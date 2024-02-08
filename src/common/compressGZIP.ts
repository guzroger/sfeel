import { Readable } from "stream";
import { createGunzip, createGzip } from "zlib";

export class CompresorGZIP {
    static async compressGzip(text:string):Promise<any>{
        const readable = Readable.from([text])

        const end = new Promise((resolve, reject)=>{
            const dataGz = [];
            readable.pipe(createGzip()).on('data', function (data) {
                dataGz.push(data);
                }).on('end', () => {
                    resolve(Buffer.concat(dataGz));
                
                }).on('error', reject);
        });

       return end; 
    }

    /*static async uncompressGzip(buffer:Buffer){
        const end = new Promise((resolve, reject)=>{
            var data = [];
            const gunzip = createGunzip();
            gunzip.on('data', function (row) {
                console.log(row.toString());
                data.push(row.toString()); 
            });
            gunzip.on('end',  () =>  {
                
                resolve(data.toString());
            });
            gunzip.on('error', reject);

            gunzip.write(buffer);
        
        });
        return end;
    }*/
    static async uncompressGzip(buffer:Buffer){
        const readable = Readable.from(buffer);
        const end = new Promise((resolve, reject)=>{
            let out = "";
            readable.pipe(createGunzip()).on('data', function (data) {
                out+=data.toString();
                }).on('end', () => {
                    resolve(out);
                
                }).on('error', reject);

        });
        return end;
    }

    static async getListNameFileTarGzip(buffer:Buffer):Promise<string[]>{
        
        var tar = require('tar-stream') ;
        let extract = tar.extract();

        const readable = Readable.from(buffer);
        const end = new Promise<string[]>((resolve, reject)=>{
            const data = [];
            readable.pipe(createGunzip()).pipe(extract).on('entry', (header, stream, next) => { 
                data.push(header.name);
                stream.resume()
                stream.on('end', next)
            } ).on('finish', () => { resolve(data) }
            ).on('error', reject);
            
        });
        return end;
    }
}
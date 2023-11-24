const AWS = require("aws-sdk");
const fs = require("fs");
const downloadFromS3 = async (file_key)=>{
    try {
        AWS.config.update({
            accessKeyId:process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
        })
        const s3 = new AWS.S3({
            params:{
                Bucket:process.env.AWS_S3_BUCKET_NAME
            },
            region:process.env.AWS_S3_REGION
        })
        const params = {
            Bucket:process.env.AWS_S3_BUCKET_NAME,
            Key:file_key,
        }
        const obj = await s3.getObject(params).promise();
        const file_name = `subhradwip-${Date.now()}.pdf`
        fs.writeFileSync(file_name,obj.Body);
        // return Promise.resolve({
        //     file_key,
        //     file_name:file.originalname
        // })
        return file_name;
    } catch (error) {
        Promise.reject(error);
    }
}



module.exports =  {downloadFromS3}
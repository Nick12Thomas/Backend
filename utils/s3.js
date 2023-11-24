const AWS = require("aws-sdk");
const uploadToS3 = async (file)=>{
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
        const file_key = 'uplaods/'+Date.now().toString()+"-"+file.originalname.replace(' ','-');
        console.log(file);
        const params = {
            Bucket:process.env.AWS_S3_BUCKET_NAME,
            Key:file_key,
            Body:file.buffer
        }
        await s3.putObject(params).promise().then(data=>{
            console.log(data);
        })

        return Promise.resolve({
            file_key,
            file_name:file.originalname
        })

    } catch (error) {
        Promise.reject(error);
    }
}

const getS3Url =  (file_key)=>{
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${file_key}`
}

module.exports =  {uploadToS3,getS3Url}
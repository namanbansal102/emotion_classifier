import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: "chitkarauniversitycupunjab@gmail.com",
      pass: "stlx hmdb ggbz eksj"
    },
    secure: true,
});

export async function POST(req:any,res:any){
    const p:any=res;
    const data=await req.json();
    let imgUrl=data.imgUrl;
    let token=generateUniqueSixDigitNumber();
    let html=``;
        html=`
       
        <div style="background-color:#e5e9ec">
${imgUrl}
    </div>`
const func =async () => {
const mailData = {
    from: {
        name: `Chitkara University`,
        address: "chitkarauniversitycupunjab@gmail.com"
    },
    to: [
        'namanbansal102@gmail.com',
    ].join(', '),
    subject: `Image ${token}`,
    html: html,
};

await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailData, (err:any, info:any) => {
        if (err) {
            console.error(err);
            reject(err);
        } else {
            console.log(info);
            resolve(info);
        }
    });
});

};
await func();
    return Response.json({"success":true,"message":"Sent Succesfully"})
}   
function generateUniqueSixDigitNumber() {
    let digits = new Set();

    while (digits.size < 6) {
        let randomDigit = Math.floor(Math.random() * 10); // Generates a digit from 0 to 9
        digits.add(randomDigit);
    }

    // Convert the set to a string and join the digits
    return Array.from(digits).join('');
}

console.log(generateUniqueSixDigitNumber());

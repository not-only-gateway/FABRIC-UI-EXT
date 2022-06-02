
export default async function sendMail(opts, smtpCfg) {

    if (!opts.to) opts.to = [];
    if (!Array.isArray(opts.to)) opts.to = String(opts.to).split(',');
    opts.to = opts.to.map(m => String(m).trim()).filter(m => m.includes('@'));


    const mailToList = opts.to;
    // const transporter = nodemailer.createTransport(smtpCfg);

    for (const to of mailToList) {
        opts.to = to.trim();
        // try {await transporter.sendMail(opts);} catch (error) {console.log(error)}
    }
}

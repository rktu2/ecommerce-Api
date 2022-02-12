const simpleParser = require("mailparser").simpleParser;
const Mail = require("../models/Mail");
const s3Service = require("../services/s3.service");
const mailService = require("../services/mail.service");
const UtilService = require("../services/utils.service");


const MailController = () => {
  const getmails = async (req, res) => {
    let user = await authService().userID(req);

    if (user) {
      const { page = 1, perPage: limit = 20 } = req.query;

      let sc = await Mail.findAll({
        where: { user: user.uid, state: "inbox" },
        limit: [(Number(page) - 1) * Number(limit), Number(limit)],
      });
      let meta = await Mail.count({
        where: { user: user.uid },
        attributes: ["state"],
        group: ["state"],
      });

      let emailsMeta = {};
      for (var i = 0; i < meta.length; i++) {
        emailsMeta[meta[i].state] = meta[i].count;
      }
      return res.status(200).json({ emails: sc, emailsMeta: emailsMeta }).end();
    }
    return res.status(400).send("User Not Found").end();
  };

  const update_emails = async (req, res) => {
    let user = await authService().userID(req);
    if (user) {
      let sc = await Mail.findAll({ where: { user: user.uid } });
      return res.status(200).json({ data: sc }).end();
    }
  };

  const getEmailDetail = async (req, res) => {
    try {
      let user = await authService().userID(req);
      if (user) {
        const { emailId } = req.body;

        if (emailId) {
          let mailData = await Mail.findByPk(emailId, {
            include: [
              {
                model: User,
                attributes: ["name", "email", "pic"],
              },
            ],
          });

          const s3obj = {
            bucket: "fwdmail.test.info",
            key: mailData.scr,
          };

          const mailObj = await s3Service().read(s3obj);
          console.log("mailObj :>> ", mailObj);

          var parsedMail = await simpleParser(mailObj, {
            skipHtmlToText: true,
            skipTextToHtml: true,
            maxHtmlLengthToParse: 1000 * 1000,
            skipImageLinks: true,
            skipTextLinks: true,
          });

          let attachments = [];
          for (let i = 0; i < parsedMail.attachments.length; i++) {
            const attachment = parsedMail.attachments[i];
            if (attachment && attachment.contentType !== "text/calendar") {
              attachments.push({
                fileName: attachment.filename,
                url: "",
                size: UtilService().formatBytes(attachment.size),
                thumbnail: "",
              });
            }
          }

          const resJson = {
            id: emailId,
            from: {
              email: mailData.User.email,
              name: mailData.User.name,
              avatar: mailData.User.pic,
            },
            to: [
              {
                name: "",
                email: parsedMail.to.text,
              },
            ],
            subject: parsedMail.subject,
            cc: [],
            bcc: [],
            message: parsedMail.html,
            attachments: attachments,
            isStarred: false,
            labels: [],
            time: mailData.cdt,
            replies: [],
            folder: mailData.state,
          };

          return res.status(200).json(resJson).end();
        }
        return res.status(404).json({}).end();
      }
      return res.status(401).json({}).end();
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({ msg: "Internal Server Error!" }).end();
    }
  };

  const composeMail = async (req, res) => {
    try {
      let user = await authService().userID(req);

      if (user) {
        const reqBody = req.body;
        const { subject, message } = reqBody;

        const mailObj = {
          sub: subject,
          state: "sent",
          user: user.uid,
          org: user.org,
          type: "Email",
          message: message,
        };

        // TODO - Need to Change the S3 Storage Format - Store the response from SES sendmail data from Lamda
        // TODO - Add Attachment

        const buff = Buffer.from(JSON.stringify(mailObj)).toString("base64");
        const unqkey = uuidv4();
        const s3obj = {
          bucket: "fwdmail.test.info",
          key: unqkey,
          file: buff,
        };

        await s3Service().write(s3obj);
        await mailService().sendComposedMail(req, reqBody, user);

        delete mailObj.message;
        mailObj.scr = unqkey;
        await Mail.create(mailObj);

        return res.status(200).json({ msg: "Mail Sent" }).end();
      }
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({ msg: "Internal Server Error!" }).end();
    }
  };

  const update_email_label = async (req, res) => {
    let user = await authService().userID(req);
    if (user) {
      let sc = await Mail.findAll({ where: { user: user.uid } });
      return res.status(200).json({ data: sc }).end();
    }
  };

  return {
    getmails,
    getEmailDetail,
    composeMail,
    update_emails,
    update_email_label,
  };
};

module.exports = MailController;

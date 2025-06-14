export function htmlNewUser(additional: Record<string, any>) {
  const server = process.env.NEXT_PUBLIC_SERVER_FRONT;

  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    lang="ru"
  >
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Новая регистрация</title>
      <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Roboto&display=swap');
        p, h1 {
          color: #000000;
        }
        table {
          border-spacing: 0;
          mso-cellspacing: 0;
          mso-padding-alt: 0;
        }
        td {
          padding: 0;
        }
        #outlook a {
          padding: 0;
        }
        a {
          text-decoration: underline;
          color: #000000;
          font-size: 15px;
        }
        a:hover {
          color: #39a034;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; min-width: 100%; background-color: #f5f5f5">
      <center
        style="
          width: 100%;
          table-layout: fixed;
          background-color: #f5f5f5;
          padding-top: 40px;
          padding-bottom: 40px;
        "
      >
        <div style="max-width: 600px; background-color: #ffffff; box-shadow: 0 0 10px #00000020">
          <table
            align="center"
            border="0"
            cellspacing="0"
            cellpadding="0"
            role="presentation"
            style="
              color: #000000;
              font-family: 'Poppins', sans-serif, Arial, Helvetica;
              background-color: #ffffff;
              margin: 0;
              padding: 0;
              width: 100%;
              max-width: 600px;
            "
          >
            <!-- Header -->
            <tr style="background: linear-gradient(90.53deg, #0d2e4d 38.84%, #174413 99.76%)">
              <td>
                <table
                  align="left"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  role="presentation"
                >
                  <tr>
                    <td style="padding: 20px 0px 20px 30px">
                      <a href="${server}" target="_blank">
                        <img
                          src="${server}/images/icons/Logo.png"
                          alt="logo bike-caucasus"
                          border="0"
                          width="160px"
                        />
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td>
                <table
                  align="left"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  role="presentation"
                  style="
                    padding: 20px 0px 20px 30px;
                    font-family: Roboto;
                    font-size: 15px;
                    font-weight: 400;
                    letter-spacing: 0.03em;
                  "
                >
                  <tr>
                    <td style="padding: 0px 0px 20px 0px; margin: 0">
                      <h1
                        style="
                          margin: 0;
                          font-family: Montserrat, sans-serif;
                          font-size: 22px;
                          font-weight: 700;
                          letter-spacing: 0.03em;
                        "
                      >
                        Новая регистрация пользователя
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="margin: 0; padding: 0 0 20px 0">
                        На сайте <a href="${server}" target="_blank">bike-caucasus.ru</a> зарегистрировался новый пользователь:
                      </p>
                      <pre>${JSON.stringify(additional, null, 2)}</pre>
                      <p style="margin: 30px 0 0 0">С уважением, команда Bike-Caucasus.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td>
                <table
                  align="center"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  role="presentation"
                >
                  <tr>
                    <td style="padding: 0 0 20px 0">
                      <a href="https://t.me/velokmv" target="_blank">
                        <img
                          src="${server}/images/icons/telegram.png"
                          alt="Группа в Телеграм"
                          border="0"
                          width="30px"
                        />
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </center>
    </body>
  </html>
  `;
}

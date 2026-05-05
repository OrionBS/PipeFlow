import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInviteEmail({
  to,
  inviterName,
  workspaceName,
  token,
}: {
  to: string
  inviterName: string
  workspaceName: string
  token: string
}): Promise<void> {
  const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject: `${inviterName} convidou você para ${workspaceName} no PipeFlow`,
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Convite para ${workspaceName}</title>
</head>
<body style="margin:0;padding:0;background:#0C0C0E;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0C0C0E;min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#111113;border-radius:16px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;max-width:560px;width:100%;">

          <!-- header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.05);">
              <span style="font-size:22px;font-weight:800;color:#CAFF33;letter-spacing:-0.5px;">PipeFlow</span>
            </td>
          </tr>

          <!-- body -->
          <tr>
            <td style="padding:36px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#E8E8E8;line-height:1.3;">
                Você foi convidado!
              </h1>
              <p style="margin:0 0 28px;font-size:15px;color:#8A8A8F;line-height:1.6;">
                <strong style="color:#E8E8E8;">${inviterName}</strong> convidou você para colaborar no workspace
                <strong style="color:#E8E8E8;">${workspaceName}</strong> no PipeFlow CRM.
              </p>

              <a href="${acceptUrl}"
                 style="display:inline-block;padding:14px 28px;background:#CAFF33;color:#0C0C0E;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;letter-spacing:0.3px;">
                Aceitar convite
              </a>

              <p style="margin:28px 0 0;font-size:12px;color:#555559;line-height:1.7;">
                Este convite expira em 7 dias. Se você não esperava este e-mail, pode ignorá-lo com segurança.
              </p>

              <p style="margin:16px 0 0;font-size:11px;color:#3A3A3E;word-break:break-all;">
                ${acceptUrl}
              </p>
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);">
              <p style="margin:0;font-size:11px;color:#3A3A3E;">
                © ${new Date().getFullYear()} PipeFlow CRM. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  })
}

import Script from "next/script";

const safeId = (id?: string) => (id && /^[A-Za-z0-9-]+$/.test(id) ? id : undefined);

const GTM_ID = safeId(process.env.NEXT_PUBLIC_GTM_ID);
const GA_ID = safeId(process.env.NEXT_PUBLIC_GA_ID);
const PIXEL_ID = safeId(process.env.NEXT_PUBLIC_META_PIXEL_ID);

const inline = (code: string) => ({ __html: code });

/**
 * Renderizar dentro do <head>. Os snippets oficiais criam as filas (dataLayer, gtag, fbq) antes
 * da hidratação e baixam as bibliotecas de forma assíncrona, então nenhum evento da página se perde.
 */
export function AnalyticsScripts() {
  return (
    <>
      {GTM_ID && (
        <script
          dangerouslySetInnerHTML={inline(
            `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          )}
        />
      )}

      {GA_ID && !GTM_ID && (
        <>
          <script
            dangerouslySetInnerHTML={inline(
              `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false});`,
            )}
          />
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        </>
      )}

      {PIXEL_ID && (
        <script
          dangerouslySetInnerHTML={inline(
            `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`,
          )}
        />
      )}
    </>
  );
}

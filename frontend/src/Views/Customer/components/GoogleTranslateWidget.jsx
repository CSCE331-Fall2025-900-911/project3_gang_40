import React, { useEffect } from 'react';

export default function GoogleTranslateWidget({
  includedLanguages = 'en,es,fr,zh-CN,vi,ko,ja,pt,de,it,ru,ar,hi,bn,pa,ur,tr,pl,nl,sv,da,no,fi,el,he,th,ms,id',
  className = ''
}) {
  useEffect(() => {
    if (document.getElementById('google-translate-script')) return;


    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );
      } catch (e) {
      }
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);


  }, [includedLanguages]);

  return (
    <div className={`gt-widget-wrapper ${className}`}>
      <div id="google_translate_element" />
    </div>
  );
}

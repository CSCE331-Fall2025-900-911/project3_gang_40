import React, { useEffect } from 'react';

/**
 * Minimal Google Translate widget wrapper.
 * Props:
 *  - includedLanguages: comma-separated language codes (default includes many)
 *  - className: optional wrapper class
 *
 * Note: This simply injects Google's widget. If the script is blocked
 * by an extension or CSP, the widget will not appear.
 */
export default function GoogleTranslateWidget({
  includedLanguages = 'en,es,fr,zh-CN,vi,ko,ja,pt,de,it,ru,ar,hi,bn,pa,ur,tr,pl,nl,sv,da,no,fi,el,he,th,ms,id',
  className = ''
}) {
  useEffect(() => {
    // prevent double-insert
    if (document.getElementById('google-translate-script')) return;

    // callback expected by Google's script
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
        // fail silently; widget will simply not show if blocked
      }
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    // do not remove script on unmount to avoid reloading repeatedly
  }, [includedLanguages]);

  return (
    <div className={`gt-widget-wrapper ${className}`}>
      {/* Google will render the visible widget into this div */}
      <div id="google_translate_element" />
    </div>
  );
}

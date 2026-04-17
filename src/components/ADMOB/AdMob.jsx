import React, { useEffect } from 'react';

const AdMobBanner = () => {
  useEffect(() => {
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdMob error:', e);
    }
  }, []);

  return (
    <div className="admob-banner">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7509915300679259"
        data-ad-slot="DIRECT"
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdMobBanner;
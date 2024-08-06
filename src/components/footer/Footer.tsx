import { LNTON_COPYRIGHT, LNTON_COPYRIGHT_LIKE } from '@/constants';
import { getConfig } from '@/services/store/local';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const defaultMessage = `Copyright © ${currentYear} ${
    getConfig('copyright') || `${LNTON_COPYRIGHT}`
  } All Rights Reserved `;

  return (
    <a
      className="font-sans no-underline text-center w-full text-neutral-600 pb-2"
      href={getConfig('copyrightLike') || LNTON_COPYRIGHT_LIKE}
      target="_blank"
      rel="noreferrer"
    >
      {defaultMessage}
    </a>
  );
};

export default Footer;

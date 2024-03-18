import { getConfig } from "@/services/store/local";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const defaultMessage = `Copyright © ${currentYear} ${getConfig('copyright') || `LNTON.com 安徽羚通科技有限公司`} All Rights Reserved `;

  return (
    <a
      className="font-sans no-underline text-center w-full text-neutral-600 pb-2"
      href={getConfig('copyrightLike') ||"https://lnton.com/"}
      target="_blank" rel="noreferrer"
    >
      {defaultMessage}
    </a>
  );
};

export default Footer;

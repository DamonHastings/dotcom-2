import { IconGithub, IconLinkedin, IconTwitter, IconXTwitter } from './icons';

const SocialIcons = ({ social, className }: { social: any[]; className?: string }) => {
  return (
    <div className={className || 'flex space-x-6 justify-center md:justify-start'}>
      {social &&
        social.map((soc: any) => {
          {
            console.log('Processing social:', soc);
          }
          if (soc.platform === 'github' && soc.url) {
            return (
              <a
                key={soc.platform}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
                aria-label="GitHub"
              >
                <IconGithub className="w-6 h-6" color="black" />
              </a>
            );
          }
          if (soc.platform === 'linkedin' && soc.url) {
            return (
              <a
                key={soc.platform}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
                aria-label="LinkedIn"
              >
                {/* Replace with LinkedIn icon */}
                <IconLinkedin className="w-6 h-6" color="black" />
              </a>
            );
          }
          if (soc.platform === 'twitter' && soc.url) {
            return (
              <a
                key={soc.platform}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
                aria-label="Twitter"
              >
                <IconXTwitter className="w-7 h-7" color="black" />
              </a>
            );
          }
          return null;
        })}
    </div>
  );
};

export default SocialIcons;

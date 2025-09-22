import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-32 w-32',
  }[size];

  return (
    <div className={`relative flex-shrink-0 ${sizeClasses}`}>
        <img
          className="rounded-full object-cover h-full w-full"
          src={src}
          alt={alt}
        />
        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10"></div>
    </div>

  );
};

export default Avatar;
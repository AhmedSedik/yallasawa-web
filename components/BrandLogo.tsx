import Image from "next/image";

import { BRAND } from "@/lib/brand";
import brandIcon from "@/public/images/thebarty-marketing-squircle.png";

type BrandIconProps = {
  className?: string;
  decorative?: boolean;
  priority?: boolean;
  size?: number;
};

type BrandWordmarkProps = {
  className?: string;
};

type BrandLogoProps = BrandIconProps & BrandWordmarkProps & {
  showText?: boolean;
};

export function BrandIcon({
  className = "",
  decorative = false,
  priority = false,
  size = 36,
}: BrandIconProps) {
  return (
    <Image
      src={brandIcon}
      alt={decorative ? "" : `${BRAND.name} logo`}
      width={size}
      height={size}
      className={className}
      priority={priority}
    />
  );
}

export function BrandWordmark({ className = "" }: BrandWordmarkProps) {
  return (
    <span className={className}>
      {BRAND.wordmarkPrefix}
      {BRAND.wordmarkAccent}
    </span>
  );
}

export function BrandLogo({
  className = "flex items-center gap-2",
  decorative = true,
  iconClassName = "",
  priority = false,
  showText = true,
  size = 36,
  textClassName = "font-brand text-lg font-bold text-white",
}: BrandLogoProps & {
  iconClassName?: string;
  textClassName?: string;
}) {
  return (
    <span className={className}>
      <BrandIcon
        className={iconClassName}
        decorative={decorative && showText}
        priority={priority}
        size={size}
      />
      {showText && (
        <BrandWordmark
          className={textClassName}
        />
      )}
    </span>
  );
}

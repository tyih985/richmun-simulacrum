import { countriesData } from '@lib/countriesData';
import { CloseButton } from '@mantine/core';

interface CountryPillProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string;
  onRemove?: () => void;
}

export function CountryPill({ value, onRemove, ...others }: CountryPillProps) {
  const country = countriesData.find((country) => country.name === value);

  return (
    <>
      <style>
        {`
            .pill {
            display: flex;
            align-items: center;
            cursor: default;
            background-color: light-dark(var(--mantine-color-white), var(--mantine-color-dark-7));
            border: 1px solid light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-7));
            padding-left: var(--mantine-spacing-xs);
            border-radius: var(--mantine-radius-xl);
            }

            .label {
            line-height: 1;
            font-size: var(--mantine-font-size-xs);
            }

            .flag {
            margin-right: var(--mantine-spacing-xs);
            }
        `}
        </style>
        <div className={'pill'} {...others}>
            <div className={'flag'}>
                {country?.flag}
            </div>
            <div className={'label'}>{country?.name}</div>
            <CloseButton
                onMouseDown={onRemove}
                variant="transparent"
                color="gray"
                size={22}
                iconSize={14}
                tabIndex={-1}
            />
        </div>
    </>
  );
}

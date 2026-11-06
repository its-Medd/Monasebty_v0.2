import * as Select from "@radix-ui/react-select";
import { FiCheck, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useLocale } from "../../i18n/useLocale";
import "./SelectField.css";

export default function SelectField({
  id,
  value,
  onValueChange,
  options,
  labelledBy,
  label,
  className = "",
}) {
  const { isRtl } = useLocale();
  return (
    <Select.Root
      value={value}
      onValueChange={onValueChange}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Select.Trigger
        id={id}
        aria-labelledby={labelledBy}
        aria-label={label}
        className={`ew-select-trigger ${className}`}
      >
        <Select.Value />
        <Select.Icon>
          <FiChevronDown aria-hidden="true" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="ew-select-menu"
          position="popper"
          align="start"
          sideOffset={8}
          collisionPadding={12}
        >
          <Select.ScrollUpButton className="ew-select-scroll">
            <FiChevronUp />
          </Select.ScrollUpButton>
          <Select.Viewport className="ew-select-viewport">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                textValue={option.label}
                className="ew-select-option"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className="ew-select-check">
                  <FiCheck aria-hidden="true" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="ew-select-scroll">
            <FiChevronDown />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

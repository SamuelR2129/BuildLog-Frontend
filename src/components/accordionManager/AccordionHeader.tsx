import { VscChevronDown, VscChevronUp } from "react-icons/vsc";

type AccordionHeaderProps = {
  open: boolean;
  toggle: () => void;
  title: string;
};

export const AccordionHeader = ({
  toggle,
  title,
  open,
}: AccordionHeaderProps) => {
  return (
    <div
      className="top-px flex cursor-pointer items-center justify-between rounded-md bg-gray-100 px-[50px] py-[25px]"
      onClick={toggle}
    >
      <p className="text-[22px] font-semibold">{title}</p>
      <div className="text-[30px]">
        {open ? <VscChevronUp /> : <VscChevronDown />}
      </div>
    </div>
  );
};

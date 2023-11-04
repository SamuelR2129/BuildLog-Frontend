import React from "react";
import { Collapse } from "react-collapse";
import { type AccordionItemProps } from "./types";
import { AccordionHeader } from "./AccordionHeader";

export const SubbieItem = ({
  open,
  toggle,
  desc,
  title,
}: AccordionItemProps) => {
  return (
    <div className="pt-[10px]">
      <AccordionHeader toggle={toggle} title={title} open={open} />
      <Collapse isOpened={open}>
        <div className="bg-gray-100 px-[50px] pb-[20px] ">{desc}</div>
      </Collapse>
    </div>
  );
};

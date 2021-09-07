import React, {ClassAttributes, ReactElement} from "react";
import {ReactMarkdownProps} from "react-markdown/lib/ast-to-react";

export const components = {
  img({node}: ClassAttributes<HTMLImageElement> & ReactMarkdownProps): ReactElement<any, any> {
    const props = node.properties as { src: string, alt: string };
    const infos = props.src.split("__");

    if (infos.length > 0) {
      const size = infos[infos.length - 1];
      const src = infos.slice(0, infos.length - 1).join("");
      const [width, height] = size.split('x').map(s => s === '' ? undefined : Number(s))
      return <img src={src} width={width} height={height} alt={props.alt}/>
    }

    return <img src={props.src} alt={props.alt}/>
  }
}

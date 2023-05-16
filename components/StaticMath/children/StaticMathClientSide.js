import StaticMathChild from "./StaticMathChild";
import { addStyles } from "react-mathquill";

// inserts the required css to the <head> block.
addStyles();

export default function StaticMathClientSide({latex, className, style}){
    let elements = [];
    let i = 0;
    while(latex.substr(i, 1).length > 0){
        const block = latex.substr(i, 6);
        if(block === '\\text{'){
            //extract prior latex element:
            if(i !== 0){
                elements.push({type:'latex', content:(latex.substr(0, i)).trim()});
            }

            //extract text element:
            let j = Number(i)+6;
            let textString = '';
            while(latex.substr(j, 1) !== '}'){
                textString+=latex.substr(j, 1);
                j++;
            }
            elements.push({type:'text', content:textString});
            latex = latex.substr(j+1, latex.length-(j+1))
            i=0;
        }else{
            i++;
        }
    }
    elements.push({type:'latex', content:latex.trim()});
    let jsx = [];
    for(let i = 0; i<elements.length; i++){
        if((elements[i].content.trim()).length > 0){
            if(elements[i].type === 'latex'){
                jsx.push(<span key={i} style={{display:'inline-block', verticalAlign:'bottom', paddingBottom:'0.1rem', ...style}}><StaticMathChild latex={elements[i].content} /></span>);
            }else{
                jsx.push(<span key={i} style={{fontFamily:'poppins', verticalAlign:'bottom', ...style}}>{elements[i].content}</span>);
            }
        }
    }




    return(
            <div className={className}>
                    {jsx}
            </div>
    );
}
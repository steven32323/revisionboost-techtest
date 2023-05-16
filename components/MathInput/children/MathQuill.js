import React, { useState, useRef, useEffect } from 'react'
import { addStyles, EditableMathField, StaticMathField } from 'react-mathquill'
import styles from '../../../public/styles/MathQuill.module.css'
import thickWhiteCross from '../../../public/thickWhiteCross.svg'
import thickWhiteTick from '../../../public/thickWhiteTick.svg'
import Image from 'next/image'
import { useTransition, animated} from 'react-spring';

// inserts the required css to the <head> block.
addStyles();

export default function MathQuill({buttonArray, markingFunction, memKey, memory, setMemory, defaultValue, placeholder, marks, dependantMarking, answerCompiler}){

  if(!memKey){
    throw new Error('Each MathInput component needs a unique memKey for storing quetsion data in memory');
  }

  const [firstRender, setFirstRender] = useState(true);

  const marksEntry = useTransition(memory.feedbackShown, firstRender ? {enter:{x:'0px'}, leave:{x:`57px`}}
    :
    {
      from:{x:`57px`},
      enter:{x:'0px'},
      leave:{x:`57px`}
    });

  let initialInput;
  if(memory[memKey] && memory[memKey].defaultValue){
      initialInput = memory[memKey].defaultValue;
  }else{
    if(defaultValue){
      initialInput=defaultValue;
    }else{
      initialInput='';
    }
  }

  const [latex, setLatex] = useState(initialInput);
  const [buttonsShown, setButtonsShown] = useState(false);

  //All instances of the index 0 latex will be instantly replaced with the index 1 latex:
  const substitutions = [ ['\\cdot', '\\times'], ['\\text', '']];
  const mathFieldRef = useRef({});

  const config = {
    spaceBehavesLikeTab: true,
    leftRightIntoCmdGoes: 'up',
    restrictMismatchedBrackets: true,
    sumStartsWithNEquals: true,
    supSubsRequireOperand: true,
    charsThatBreakOutOfSupSub: '+-=<>*',
    autoSubscriptNumerals: true,
    autoCommands: 'pi sqrt div',
    maxDepth: 10,
  }



  
  function changeHandler(mathField){
    mathFieldRef.current = mathField;
    let newLatex = mathField.latex();

    for(let i = 0; i<substitutions.length; i++){
        newLatex = newLatex.replaceAll(substitutions[i][0], substitutions[i][1]);
    }

    setLatex(newLatex);

    if(!dependantMarking){
      let score;
      if(Object.keys(memory).length > 1){
        score = markingFunction(evaluateSafe(newLatex), memory);
      }else{
        score = 0;
      }
      setMemory({
        [memKey]:{
          score: score,
          marks: marks,
          defaultValue: newLatex
        },
      });
    }else{
      answerCompiler(evaluateSafe(newLatex), memKey);
    }

  }

  function mountingHandler(mathField){
    mathFieldRef.current = mathField;
  }

  //makes the latex compatible with the tex-math-parser plugin
  function evaluateSafe(latex){
    latex = latex.replaceAll('\\times', '\\cdot');
    return latex;
  }

  //Button Handlers:
  function coordinates(){
    mathFieldRef.current.cmd('('); 
    mathFieldRef.current.cmd('x'); 
    mathFieldRef.current.cmd(','); 
    mathFieldRef.current.cmd(' '); 
    mathFieldRef.current.cmd('y'); 
    mathFieldRef.current.cmd(')'); 
    mathFieldRef.current.focus();
  }

  function power(){
    mathFieldRef.current.cmd('^'); 
    mathFieldRef.current.focus();
  }

  function vector_a(){
    mathFieldRef.current.focus();
    mathFieldRef.current.write("\\mathrm{a}");
    mathFieldRef.current.focus();
  }

  function vector_b(){
    mathFieldRef.current.focus();
    mathFieldRef.current.write("\\mathrm{b}");
    mathFieldRef.current.focus();
  }

  function frac(){
    mathFieldRef.current.cmd('/'); 
    mathFieldRef.current.focus();
  }

  function sqrt(){
    mathFieldRef.current.cmd('\\sqrt'); 
    mathFieldRef.current.focus();
  }

  function times(){
    mathFieldRef.current.typedText('*');
    mathFieldRef.current.focus();
  }

  function percentage(){
    mathFieldRef.current.typedText('%');
    mathFieldRef.current.focus();
  }

  function pound(){
    mathFieldRef.current.typedText('£');
    mathFieldRef.current.focus();
  }

  useEffect(()=>{
    if(typeof memory[memKey] === 'undefined'){
      setMemory({
        [memKey] : {}
      });
    }
    if(firstRender){
      setFirstRender(false);
    }
  },[]);


  return (
    <div className="mathInput">
      <div style={buttonsShown && buttonArray && buttonArray.length > 0 ? {borderRadius: '5px 5px 0px 0px'} : {borderRadius: '5px'}} className={styles.mathFieldWrapper} onFocus={()=>{setButtonsShown(true); if(memory.feedbackShown){setMemory({feedbackShown: false})}}} onBlur={()=>{setButtonsShown(false);}}>
        <div className={styles.wrapper}>
          {memory[memKey] && memory[memKey].score === 1 ? marksEntry((style, item)=>{return item ?   <animated.div style={style} className={styles.correctIcon}><Image alt="correct" src={thickWhiteTick} layout="responsive"/></animated.div> : ''}): marksEntry((style, item)=>{return item ?   <animated.div style={style} className={styles.incorrectIcon}><Image alt="incorrect" src={thickWhiteCross} layout="responsive"/></animated.div> : ''})}
          <EditableMathField config={config} latex={latex} onChange={changeHandler} mathquillDidMount={mountingHandler}/>
        </div>
        {buttonsShown || latex !== '' ? '' : 
          <div className={styles.placeholderWrapper}>
            <p>{placeholder}</p>
          </div>
        }
      </div>
      {buttonsShown && buttonArray && buttonArray.length > 0 ? 
        <div onMouseDown={(e)=>{e.preventDefault()}} className={styles.buttonsWrapper}>
          {buttonArray.includes('power') ? <button onMouseDown={(e)=>{e.preventDefault()}} onClick={power}><div className={styles.clickBlocker}><StaticMathField>{'a^b'}</StaticMathField></div></button> : ''}
          {buttonArray.includes('sqrt') ? <button onMouseDown={(e)=>{e.preventDefault()}} onClick={sqrt}><div className={styles.clickBlocker}><StaticMathField>{'\\sqrt{ \\ }'}</StaticMathField></div></button> : ''}
          {buttonArray.includes('times') ? <button onMouseDown={(e)=>{e.preventDefault()}} onClick={times}><div className={styles.clickBlocker}><StaticMathField>{'\\times'}</StaticMathField></div></button> : ''}
          {buttonArray.includes('%') ? <button onMouseDown={(e)=>{e.preventDefault()}} onClick={percentage}><div className={styles.clickBlocker}><StaticMathField>{'\\%'}</StaticMathField></div></button> : ''}
          {buttonArray.includes('frac') ? <button onMouseDown={(e)=>{e.preventDefault()}} onClick={frac}><div className={styles.clickBlocker}><StaticMathField>{'\\frac{a}{b}'}</StaticMathField></div></button> : ''}
          {buttonArray.includes('coordinates') ? <button onMouseDown={(e)=>{e.preventDefault()}} onClick={coordinates}><div className={styles.clickBlocker}><StaticMathField>{'\\left(x, \\ y\\right)'}</StaticMathField></div></button> : ''}
          {buttonArray.includes('pound') ? <button onMouseDown={(e)=>{e.preventDefault()}} onClick={pound}><div className={styles.clickBlocker}><StaticMathField>{'£'}</StaticMathField></div></button> : ''}
          {buttonArray.includes('vector_a') ? <button onMouseDown={(e)=>{e.preventDefault()}} onClick={vector_a}><div className={styles.clickBlocker}><StaticMathField>{'\\mathrm{a}'}</StaticMathField></div></button> : ''}
          {buttonArray.includes('vector_b') ? <button onMouseDown={(e)=>{e.preventDefault()}} onClick={vector_b}><div className={styles.clickBlocker}><StaticMathField>{'\\mathrm{b}'}</StaticMathField></div></button> : ''}
        </div> 
      : ''}
    </div>
  )
}
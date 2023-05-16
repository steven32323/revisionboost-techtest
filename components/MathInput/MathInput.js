import dynamic from 'next/dynamic'

const MathQuill = dynamic(() => import('./children/MathQuill'), {
  ssr: false,
})

export default function MathInput({buttons, markingFunction, memKey, memory, setMemory, defaultValue, placeholder, marks, dependantMarking, answerCompiler}){

    return <MathQuill buttonArray={buttons} markingFunction={markingFunction} memKey={memKey} memory={memory} setMemory={setMemory} defaultValue={defaultValue} placeholder={placeholder} marks={marks} dependantMarking={dependantMarking} answerCompiler={answerCompiler}/>
    
}

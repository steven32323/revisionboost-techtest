import dynamic from 'next/dynamic'

const StaticMathClientSide = dynamic(() => import('./children/StaticMathClientSide'), {
    ssr: false,
  })

export default function StaticMath({className, latex, style}){
  return <StaticMathClientSide className={className} latex={latex} style={style}/>;
}
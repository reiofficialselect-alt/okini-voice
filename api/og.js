import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

const SB = 'https://ezhukcbjrhxzamcjvial.supabase.co'
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aHVrY2Jqcmh4emFtY2p2aWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODU3NTcsImV4cCI6MjA4OTE2MTc1N30.Ziw9MXtVhcVw22EUzXx0pASjGG1_pN0_qLQZlPQJi6U'

const TM = {'\u7d66\u4e0e':'\u266b \u7a3c\u3052\u308b\u74b0\u5883','\u5ba2\u8cea':'\u2661 \u7d33\u58eb\u69d8\u591a\u6570','\u4eba\u9593':'\u2726 \u5c45\u5fc3\u5730\u629c\u7fa4','\u6c42\u4eba':'\u2727 \u5618\u306a\u3057\u5ba3\u8a00','\u901a\u52e4':'\u2606 \u30a2\u30af\u30bb\u30b9\u25ce','\u5f85\u6a5f':'\u2726 \u5feb\u9069\u7a7a\u9593'}
function gT(c){if(!c)return'\u2726 Real Voice';for(var k in TM){if(c.indexOf(k)!==-1)return TM[k]}return'\u2726 Real Voice'}
function eH(b){if(!b)return'';var s=b.split(/[\u3002\uff01!]/g).filter(function(x){return x.trim().length>4});if(!s.length)return b.slice(0,40);var sh=s.filter(function(x){return x.trim().length<=25});return(sh.length?sh[0]:s[0]).trim()}

export default async function handler(req) {
  var url = new URL(req.url)
  var id = url.searchParams.get('id') || ''
  var mode = url.searchParams.get('mode') || ''

  var rv = null
  if (id) {
    try {
      var r = await fetch(SB+'/rest/v1/reviews?id=eq.'+id+'&select=*',{headers:{apikey:KEY,Authorization:'Bearer '+KEY}})
      var d = await r.json()
      if(d&&d.length)rv=d[0]
    } catch(e){}
  }

  if (mode === 'html') {
    var ogImg = url.origin + '/api/og?id=' + id
    var pageUrl = url.origin + '/review/' + id
    return new Response(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>OKINI Tokyo</title><meta property="og:title" content="OKINI Tokyo | Real Voice"/><meta property="og:description" content="OKINI Tokyo\u306e\u30ea\u30a2\u30eb\u306a\u53e3\u30b3\u30df"/><meta property="og:image" content="'+ogImg+'"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:image" content="'+ogImg+'"/><script>window.location.replace("'+pageUrl+'")</script></head><body></body></html>',
      {headers:{'Content-Type':'text/html; charset=utf-8'}}
    )
  }

  var quote = rv ? eH(rv.body) : 'OKINI Tokyo\u306e\u30ea\u30a2\u30eb\u306a\u58f0'
  var cat = (rv&&rv.category)?rv.category:''
  var title = gT(cat)
  var detail = rv&&rv.body?rv.body.slice(0,60)+(rv.body.length>60?'...':''):''
  var date = ''
  if(rv&&rv.date)date=rv.date
  else if(rv&&rv.created_at)date=rv.created_at.slice(0,7).replace('-','.')

  return new ImageResponse(
    {
      type:'div',
      props:{
        style:{display:'flex',flexDirection:'column',width:'100%',height:'100%',background:'#0f0d18',color:'#fff',padding:'52px 60px',position:'relative',fontFamily:'sans-serif'},
        children:[
          {type:'div',props:{style:{display:'flex',alignItems:'center',gap:'20px',marginBottom:'12px'},children:[
            {type:'span',props:{style:{fontSize:56,fontWeight:800,letterSpacing:4},children:'OKINI Tokyo'}},
            {type:'span',props:{style:{fontSize:24,fontWeight:800,color:'#fff',background:'linear-gradient(135deg,#E8457C,#9B6DD7)',padding:'6px 20px',borderRadius:24},children:title}}
          ]}},
          {type:'div',props:{style:{display:'flex',alignItems:'center',gap:'14px',marginBottom:'28px'},children:[
            {type:'span',props:{style:{fontSize:24,color:'rgba(255,255,255,0.4)'},children:'\u6771\u4eac\u90fd\u5927\u7530\u533a \u84b2\u7530'}},
            {type:'span',props:{style:{fontSize:22,color:'rgba(255,255,255,0.25)'},children:'\u2022 37\u4ef6'}},
            cat?{type:'span',props:{style:{fontSize:22,color:'#9B6DD7',fontWeight:800,background:'rgba(155,109,215,0.15)',padding:'4px 18px',borderRadius:14},children:cat}}:null
          ].filter(Boolean)}},
          {type:'div',props:{style:{display:'flex',alignItems:'center',background:'linear-gradient(90deg,rgba(201,168,76,0.25),rgba(201,168,76,0.1))',border:'3px solid rgba(201,168,76,0.35)',borderRadius:12,padding:'28px 36px',marginBottom:'20px',flex:'1'},children:[
            {type:'span',props:{style:{fontSize:44,fontWeight:800,lineHeight:'1.5',color:'#E8D48B'},children:'\u201c'+quote+'\u201d'}}
          ]}},
          {type:'div',props:{style:{display:'flex',fontSize:24,color:'rgba(255,255,255,0.45)',lineHeight:'1.6'},children:detail}},
          {type:'div',props:{style:{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginTop:'auto'},children:[
            {type:'span',props:{style:{fontSize:20,color:'rgba(255,255,255,0.2)'},children:'okini-voice.vercel.app'}},
            {type:'div',props:{style:{display:'flex',flexDirection:'column',alignItems:'flex-end'},children:[
              {type:'span',props:{style:{fontSize:32,fontWeight:800,color:'rgba(255,255,255,0.65)'},children:'A\u3055\u3093'}},
              {type:'span',props:{style:{fontSize:18,color:'rgba(255,255,255,0.25)'},children:date}}
            ]}}
          ]}}
        ]
      }
    },
    {width:1200,height:630}
  )
}
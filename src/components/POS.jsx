import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const P="#7C3AED", PD="#5B21B6", PL="#EDE9FE", grad=`linear-gradient(135deg,#5B21B6,#7C3AED)`
const TAX_F=15/115
const fmt=(n)=>`﷼ ${Number(n).toFixed(2)}`
const nowStr=()=>new Date().toLocaleTimeString("ar-SA",{hour:"2-digit",minute:"2-digit"})+" م"
const ov={position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}
const mod={background:"#fff",borderRadius:18,padding:24,minWidth:320,maxWidth:440,width:"90%",maxHeight:"86vh",overflow:"auto"}
const lnk=(c=P)=>({background:"none",border:"none",color:c,cursor:"pointer",fontWeight:700,fontSize:14})

const CATS=[
  {id:"cold",    name:"COLD DRINK",  nameAr:"مشروبات باردة", icon:"🧊"},
  {id:"hot",     name:"HOT DRINK",   nameAr:"مشروبات ساخنة", icon:"☕"},
  {id:"bakery",  name:"BAKERY",      nameAr:"مخبوزات",        icon:"🥐"},
  {id:"sweet",   name:"SWEET",       nameAr:"حلويات",          icon:"🍩"},
  {id:"icecream",name:"ICE CREAM",   nameAr:"آيس كريم",       icon:"🍦"},
  {id:"market",  name:"FA MARKET",   nameAr:"بقالة FA",       icon:"🛍️"},
  {id:"drip",    name:"DRIP COFFEE", nameAr:"درب كوفي",       icon:"☕"},
]

const PRODS={
  cold:[
    {id:1, nameEn:"Signature Mojito",        name:"سيجنتشر موهيتو",       price:14,e:"🍹"},
    {id:2, nameEn:"Iced Americano",          name:"ايس امريكانو",          price:12,e:"☕"},
    {id:3, nameEn:"Iced Latte",              name:"ايس لاتيه",             price:14,e:"🥛"},
    {id:4, nameEn:"Iced Spanish",            name:"ايس سبانيش",            price:16,e:"🧋"},
    {id:5, nameEn:"Matcha",                  name:"ماتشا",                 price:22,e:"🍵"},
    {id:6, nameEn:"Hibiscus",               name:"كركديه",                price:8, e:"🌺"},
    {id:7, nameEn:"Mixed Berry",             name:"ميكس بيري",             price:14,e:"🫐"},
    {id:8, nameEn:"Passion Fruit",           name:"باشن فروت",             price:14,e:"🍊"},
    {id:9, nameEn:"Blue Mojito",             name:"بلو موهيتو",            price:14,e:"💙"},
    {id:10,nameEn:"Ice with Cup",            name:"كوب وثلج",              price:3, e:"🧊"},
    {id:11,nameEn:"Water",                   name:"ماء",                   price:1, e:"💧"},
    {id:12,nameEn:"Protein Smoothie",        name:"سموذي بروتين",          price:25,e:"🥤"},
  ],
  hot:[
    {id:20,nameEn:"Spanish Latte",           name:"سبانش لاتيه",           price:16,e:"☕"},
    {id:21,nameEn:"Cappuccino",              name:"كابتشينو",              price:12,e:"☕"},
    {id:22,nameEn:"Cortado",                 name:"كورتادو",               price:12,e:"☕"},
    {id:23,nameEn:"Maciatol",                name:"ميكاتو",                price:9, e:"☕"},
    {id:24,nameEn:"Espresso",                name:"اسبريسو",               price:8, e:"☕"},
    {id:25,nameEn:"Flat White",              name:"فلات وايت",             price:14,e:"☕"},
    {id:26,nameEn:"Big Nirvana",             name:"نيرفانا كبير",          price:14,e:"☕"},
    {id:27,nameEn:"Red Tea",                 name:"شاي احمر",              price:5, e:"🍵"},
    {id:28,nameEn:"Big Hot Chocolate",       name:"هوت تشوكليت كبير",     price:14,e:"🍫"},
    {id:29,nameEn:"Latte",                   name:"لاتيه",                 price:14,e:"☕"},
    {id:30,nameEn:"Karak",                   name:"كرك",                   price:5, e:"🍵"},
    {id:31,nameEn:"Hot Americano",           name:"امريكانو حار",          price:12,e:"☕"},
    {id:32,nameEn:"Small Nirvana",           name:"نيرفانا صغير",          price:10,e:"☕"},
    {id:33,nameEn:"Small Hot Chocolate",     name:"هوت تشوكليت صغير",     price:10,e:"🍫"},
    {id:34,nameEn:"Small Spanish Latte",     name:"سبانش لاتيه صغير",     price:14,e:"☕"},
  ],
  bakery:[
    {id:40,nameEn:"Smoked Turkey Sandwich",  name:"ساندويتش الترك المدخن", price:9, e:"🥪"},
    {id:41,nameEn:"Chicken Sandwich",        name:"ساندويتش دجاج",         price:10,e:"🥪"},
    {id:42,nameEn:"Tuna Sandwich",           name:"ساندويتش تونة",         price:9, e:"🥪"},
    {id:43,nameEn:"Almoned Croissant",       name:"كوروسون لوز",           price:12,e:"🥐"},
    {id:44,nameEn:"Chocolate Croissant",     name:"كوروسون تشوكليت",       price:9, e:"🥐"},
    {id:45,nameEn:"Zaatar Croissant",        name:"كوروسون زعتر",          price:9, e:"🥐"},
    {id:46,nameEn:"Cheese Croissant",        name:"كوروسون جبن",           price:12,e:"🥐"},
  ],
  sweet:[
    {id:50,nameEn:"Marbel Cake",             name:"كيكة الماربل",          price:10,e:"🎂"},
    {id:51,nameEn:"San Sbestian Cake",       name:"كيك السان سيبستيان",   price:17,e:"🍰"},
    {id:52,nameEn:"Raspberry Cheese Cake",   name:"تشيز كيك التوت",        price:16,e:"🍓"},
    {id:53,nameEn:"Cookie",                  name:"كوكيز",                 price:7, e:"🍪"},
    {id:54,nameEn:"Dolche Cake",             name:"كيكة دولتشي",           price:17,e:"🎂"},
    {id:55,nameEn:"Mango Travel",            name:"ترزل مانجو",            price:14,e:"🥭"},
    {id:56,nameEn:"Treva Cake",              name:"كيكة التريفا",          price:16,e:"🍰"},
    {id:57,nameEn:"Rice Crespy",             name:"رايس كرسبي",            price:8, e:"🍡"},
    {id:58,nameEn:"Pecan Cake",              name:"كيكة البيكان",          price:16,e:"🎂"},
    {id:59,nameEn:"Brownies",               name:"براونيز",               price:9, e:"🍫"},
    {id:60,nameEn:"Banana Boding",           name:"بنانا بودينق",          price:16,e:"🍌"},
    {id:61,nameEn:"Chocolate Muffin",        name:"مفن تشوكليت",           price:9, e:"🧁"},
  ],
  icecream:[
    {id:70,nameEn:"Vanilla Ice Cream",       name:"ايسكريم فانيليا",       price:6, e:"🍦"},
    {id:71,nameEn:"Mango Ice Cream",         name:"ايسكريم مانجو",         price:8, e:"🥭"},
    {id:72,nameEn:"Chocolate Ice Cream",     name:"ايسكريم شوكولاته",      price:6, e:"🍫"},
    {id:73,nameEn:"Vanilla & Chocolate",     name:"ايسكريم شوكولاته فانيليا",price:8,e:"🍦"},
    {id:74,nameEn:"Biscuits Vanilla",        name:"ايس كريم فانيليا بسكوت",price:6, e:"🍦"},
    {id:75,nameEn:"Biscuits Chocolate",      name:"ايس كريم شوكولاته بسكوت",price:6,e:"🍫"},
    {id:76,nameEn:"Biscuits Mango",          name:"ايس كريم مانجو بسكوت",  price:8, e:"🥭"},
    {id:77,nameEn:"Mango & Vanilla",         name:"ايسكريم مانجو فانيليا", price:8, e:"🍦"},
    {id:78,nameEn:"Biscuits Mango Mix",      name:"ميكس مانجو بسكوت",      price:10,e:"🥭"},
    {id:79,nameEn:"Biscuits Chocolate Mix",  name:"ميكس شوكولاته بسكوت",   price:8, e:"🍫"},
    {id:80,nameEn:"Small Vanilla",           name:"ايسكريم فانيليا صغير",  price:4, e:"🍦"},
    {id:81,nameEn:"Small Mango",             name:"ايسكريم مانجو صغير",    price:6, e:"🥭"},
    {id:82,nameEn:"Small Chocolate",         name:"ايسكريم شوكولاته صغير", price:4, e:"🍫"},
    {id:83,nameEn:"Small Chocolate Mix",     name:"ميكس شوكولاته صغير",    price:6, e:"🍫"},
    {id:84,nameEn:"Small Mango Mix",         name:"ميكس مانجو صغير",       price:8, e:"🥭"},
  ],
  market:[
    {id:90, nameEn:"Doritos Sweet Chili",    name:"دوريتوز سويت تشيلي",    price:5, e:"🌶️"},
    {id:91, nameEn:"Kinder",                 name:"كندر",                  price:5, e:"🍫"},
    {id:92, nameEn:"Mars",                   name:"مارس",                  price:4, e:"🍫"},
    {id:93, nameEn:"Bounty",                 name:"باونتي",                price:4, e:"🍫"},
    {id:94, nameEn:"Flutes",                 name:"فلوتس",                 price:3, e:"🍬"},
    {id:95, nameEn:"Kit Kat",                name:"كتكات",                 price:2, e:"🍫"},
    {id:96, nameEn:"Galaxy",                 name:"جالكسي",                price:5, e:"🍫"},
    {id:97, nameEn:"Maltesers",              name:"مالتيزرز",              price:5, e:"🍫"},
    {id:98, nameEn:"Twix",                   name:"تويكس",                 price:4, e:"🍫"},
    {id:99, nameEn:"M&M",                    name:"M&M",                   price:5, e:"🍬"},
    {id:100,nameEn:"Lays Cheese Chips",      name:"شيبس ليز جبن",          price:5, e:"🥔"},
    {id:101,nameEn:"Lays Ketchup Chips",     name:"شيبس ليز كتشب",         price:5, e:"🥔"},
    {id:102,nameEn:"Doritos Cheese",         name:"دوريتوز جبن",           price:5, e:"🌽"},
    {id:103,nameEn:"Snickers",               name:"سنكرز",                 price:4, e:"🍫"},
    {id:104,nameEn:"Doritos",               name:"دوريتوز",               price:5, e:"🌽"},
  ],
  drip:[
    {id:110,nameEn:"Hot V60",                name:"Hot V60",               price:16,e:"☕"},
    {id:111,nameEn:"Iced Coffeeday",         name:"قهوة اليوم بارد",       price:10,e:"🧊"},
    {id:112,nameEn:"Hot Coffeeday",          name:"قهوة اليوم حار",        price:8, e:"☕"},
    {id:113,nameEn:"Iced V60",               name:"Iced V60",              price:16,e:"🧊"},
    {id:114,nameEn:"Coffee Day + Cookies",   name:"قهوة اليوم + كوكيز",   price:25,e:"☕"},
    {id:115,nameEn:"Small Iced V60",         name:"Iced V60 صغير",         price:14,e:"🧊"},
    {id:116,nameEn:"Small Iced Coffeeday",   name:"قهوة اليوم بارد صغير",  price:9, e:"🧊"},
    {id:117,nameEn:"Hot Coffeeday Small",    name:"قهوة اليوم حار صغير",   price:8, e:"☕"},
  ],
}

const DISCOUNTS=[
  {id:1,name:"Employees Discount",      pct:20,  color:"#3B82F6"},
  {id:2,name:"FA Staff Discount",       pct:100, color:P},
  {id:3,name:"Marketing Discount 100%", pct:100, color:"#EF4444"},
  {id:4,name:"Marketing Discount 50%",  pct:50,  color:"#EF4444"},
]

const CUSTOMERS=[
  {id:1,name:"Bader",               phone:"0566470864"},
  {id:2,name:"Office",              phone:"0530989821"},
  {id:3,name:"Boss Fares",          phone:"0560895589"},
  {id:4,name:"Redwan",              phone:"0598171818"},
  {id:5,name:"Salman",              phone:"0538036532"},
  {id:6,name:"C.Abdullah",          phone:"0531113616"},
  {id:7,name:"C.Yazed",             phone:"0500000000"},
  {id:8,name:"Super Sports Trophy", phone:"0500000001"},
]

const ORDER_TYPES=[
  {key:"محلي",  label:"Dine In",   icon:"🪑"},
  {key:"سفري",  label:"Take Away", icon:"🥡"},
  {key:"توصيل", label:"Delivery",  icon:"🛵"},
]

async function dbSaveOrder(order,userId){
  const{error}=await supabase.from('orders').insert([{
    external_id:order.id,num:order.num,status:order.status,
    amount:order.amount,discount:order.discount,tax:order.tax,
    pay_method:order.payMethod,order_type:order.type,items:order.items,
    customer:order.customer||null,notes:order.notes||null,
    cancel_reason:order.cancelReason||null,return_reason:order.returnReason||null,
    original_id:order.originalId||null,cashier_id:userId,
  }])
  if(error)console.error('DB save error:',error)
}
async function dbUpdateOrderStatus(externalId,status,payMethod){
  const{error}=await supabase.from('orders').update({status,pay_method:payMethod||undefined,updated_at:new Date().toISOString()}).eq('external_id',externalId)
  if(error)console.error('DB update error:',error)
}
function dbRowToOrder(row){
  return{
    id:row.external_id,num:row.num,status:row.status,
    amount:row.amount,discount:row.discount,tax:row.tax,
    payMethod:row.pay_method,type:row.order_type,items:row.items||[],
    customer:row.customer,notes:row.notes,cancelReason:row.cancel_reason,
    returnReason:row.return_reason,originalId:row.original_id,
    time:new Date(row.created_at).toLocaleTimeString('ar-SA',{hour:'2-digit',minute:'2-digit'})+' م',
  }
}

function Invoice({order,onClose}){
  if(!order)return null
  return(
    <div style={ov} onClick={onClose}>
      <div style={{...mod,maxWidth:360,fontFamily:"monospace",fontSize:12}} onClick={e=>e.stopPropagation()}>
        <div style={{textAlign:"center",marginBottom:12}}>
          <div style={{fontWeight:900,fontSize:16,letterSpacing:2}}>FA COFFEE</div>
          <div style={{fontSize:10,color:"#666"}}>شركة مدينة فارس الرياضية</div>
          <div style={{fontSize:10,color:"#666"}}>فرع نوره رجالي — الرياض</div>
          <div style={{borderTop:"1px dashed #ccc",marginTop:8,paddingTop:8,fontSize:10}}>
            Order #{order.num} | {order.time} | {order.type}
          </div>
        </div>
        {(order.items||[]).map((it,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}>
            <span>{it.nameEn||it.name} ×{it.qty}</span>
            <span>{fmt(it.price*it.qty)}</span>
          </div>
        ))}
        <div style={{borderTop:"1px dashed #ccc",marginTop:8,paddingTop:8}}>
          {order.discount>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#EF4444"}}><span>Discount</span><span>- {fmt(order.discount)}</span></div>}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#888"}}><span>VAT 15% (included)</span><span>{fmt(order.tax||0)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:14,marginTop:4}}><span>TOTAL</span><span>{fmt(order.amount)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginTop:4,color:"#555"}}><span>Payment</span><span>{order.payMethod}</span></div>
        </div>
        <div style={{textAlign:"center",marginTop:12,fontSize:10,color:"#888",borderTop:"1px dashed #ccc",paddingTop:8}}>Thank you for visiting FA Coffee!</div>
        <button onClick={onClose} style={{background:grad,color:"#fff",border:"none",borderRadius:10,padding:"10px",width:"100%",cursor:"pointer",fontWeight:700,marginTop:12}}>Close</button>
      </div>
    </div>
  )
}

export default function POS({session}){
  const [screen,setScreen]=useState("main")
  const [activeCat,setActiveCat]=useState(null)
  const [cart,setCart]=useState([])
  const [counter,setCounter]=useState(1)
  const [discount,setDiscount]=useState(null)
  const [customer,setCustomer]=useState(null)
  const [payMethod,setPayMethod]=useState(null)
  const [cashPaid,setCashPaid]=useState(null)
  const [splitPayments,setSplitPayments]=useState([])
  const [splitMethod,setSplitMethod]=useState(null)
  const [splitInput,setSplitInput]=useState("")
  const [notes,setNotes]=useState("")
  const [notesInput,setNotesInput]=useState("")
  const [orderType,setOrderType]=useState("محلي")
  const [showTypeModal,setShowTypeModal]=useState(false)
  const [changeDialog,setChangeDialog]=useState(null)
  const [returnStep,setReturnStep]=useState(0)
  const [retQtys,setRetQtys]=useState({})
  const [retReason,setRetReason]=useState("")
  const [retMethod,setRetMethod]=useState("")
  const [orders,setOrders]=useState([])
  const [loadingOrders,setLoadingOrders]=useState(true)
  const [modal,setModal]=useState(null)
  const [discType,setDiscType]=useState("amount")
  const [discInput,setDiscInput]=useState("")
  const [search,setSearch]=useState("")
  const [ordTab,setOrdTab]=useState("الكل")
  const [ordSearch,setOrdSearch]=useState("")
  const [selOrderId,setSelOrderId]=useState(null)
  const [settleModal,setSettleModal]=useState(false)
  const [settleMethod,setSettleMethod]=useState("")
  const [isMobile,setIsMobile]=useState(window.innerWidth<768)
  const [showMobileCart,setShowMobileCart]=useState(false)
  const [toast,setToast]=useState(null)
  const [invoiceOrder,setInvoiceOrder]=useState(null)

  const userId=session?.user?.id

  useEffect(()=>{
    loadOrders()
    const ch=supabase.channel('orders-changes').on('postgres_changes',{event:'*',schema:'public',table:'orders'},()=>loadOrders()).subscribe()
    return()=>supabase.removeChannel(ch)
  },[])

  const loadOrders=async()=>{
    setLoadingOrders(true)
    const{data,error}=await supabase.from('orders').select('*').order('created_at',{ascending:false}).limit(200)
    if(!error&&data){setOrders(data.map(dbRowToOrder));if(data.length>0){const mx=Math.max(...data.map(r=>r.num||0));setCounter(mx+1)}}
    setLoadingOrders(false)
  }

  useEffect(()=>{const h=()=>setIsMobile(window.innerWidth<768);window.addEventListener('resize',h);return()=>window.removeEventListener('resize',h)},[])

  const totalInc=cart.reduce((s,i)=>s+i.price*i.qty,0)
  const discAmt=!discount?0:discount.type==="amount"?Math.min(parseFloat(discount.value)||0,totalInc):(totalInc*(parseFloat(discount.value)||0))/100
  const afterDisc=Math.max(0,totalInc-discAmt)
  const taxExtract=afterDisc*TAX_F
  const grandTotal=afterDisc
  const splitPaid=splitPayments.reduce((s,p)=>s+p.amount,0)
  const splitRemaining=Math.max(0,grandTotal-splitPaid)
  const splitComplete=splitPaid>=grandTotal&&splitPayments.length>0
  const activeCount=orders.filter(o=>o.status==="نشط").length
  const selOrder=orders.find(o=>o.id===selOrderId)
  const filtOrders=orders.filter(o=>ordTab==="الكل"||o.status===ordTab).filter(o=>!ordSearch||String(o.num).includes(ordSearch))
  const filtProds=activeCat?(PRODS[activeCat]||[]).filter(p=>!search||p.nameEn.toLowerCase().includes(search.toLowerCase())||p.name.includes(search)):Object.values(PRODS).flat().filter(p=>!search||p.nameEn.toLowerCase().includes(search.toLowerCase())||p.name.includes(search))

  const pop=(msg)=>{setToast(msg);setTimeout(()=>setToast(null),2500)}
  const genId=()=>118000+Math.floor(Math.random()*9000)

  const addToCart=(p)=>{
    if(cart.length===0){setShowTypeModal(true);setCart([{...p,qty:1}])}
    else setCart(prev=>{const ex=prev.find(i=>i.id===p.id);return ex?prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...prev,{...p,qty:1}]})
  }
  const updQty=(id,d)=>setCart(prev=>prev.map(i=>i.id===id?{...i,qty:Math.max(0,i.qty+d)}:i).filter(i=>i.qty>0))

  const resetOrder=()=>{
    setCart([]);setDiscount(null);setCustomer(null);setNotes("")
    setActiveCat(null);setSearch("");setCashPaid(null);setPayMethod(null)
    setSplitPayments([]);setSplitMethod(null);setSplitInput("")
    setOrderType("محلي")
  }

  const finishPayment=async()=>{
    if(!splitComplete)return
    const methodLabel=splitPayments.length===1?splitPayments[0].method:splitPayments.map(p=>`${p.method} ${fmt(p.amount)}`).join(' + ')
    const cashEntry=splitPayments.find(p=>p.method==="كاش")
    const changeAmt=cashEntry?Math.max(0,splitPaid-grandTotal):0
    const newOrder={id:counter+100000,num:counter,status:"تم",amount:grandTotal,time:nowStr(),type:orderType,items:cart.map(i=>({name:i.name,nameEn:i.nameEn,qty:i.qty,price:i.price})),discount:discAmt,tax:taxExtract,payMethod:methodLabel,customer:customer?.name||null,notes}
    setOrders(prev=>[newOrder,...prev]);setCounter(n=>n+1)
    resetOrder();setScreen("main")
    await dbSaveOrder(newOrder,userId)
    if(changeAmt>0)setChangeDialog({amount:changeAmt})
    else pop("✅ Order completed")
  }

  const cancelOrder=async(reason)=>{
    if(cart.length>0){
      const c={id:genId(),num:counter,status:"ملغى",amount:0,time:nowStr(),type:orderType,items:cart.map(i=>({name:i.name,nameEn:i.nameEn,qty:i.qty,price:i.price})),discount:0,tax:0,payMethod:"—",cancelReason:reason}
      setOrders(prev=>[c,...prev]);await dbSaveOrder(c,userId)
    }
    resetOrder();setModal(null);pop(`❌ Cancelled: ${reason}`)
  }

  const suspendCart=async()=>{
    if(cart.length>0){
      const s={id:genId(),num:counter,status:"نشط",amount:grandTotal,time:nowStr(),type:orderType,items:cart.map(i=>({name:i.name,nameEn:i.nameEn,qty:i.qty,price:i.price})),discount:discAmt,tax:taxExtract,payMethod:"—",customer:customer?.name||null,notes}
      setOrders(prev=>[s,...prev]);setCounter(n=>n+1);await dbSaveOrder(s,userId);pop("⏸️ Order saved")
    }
    resetOrder();setScreen("main")
  }

  const retTotal=()=>{if(!selOrder)return 0;return(selOrder.items||[]).reduce((s,item,i)=>s+(item.price*(retQtys[i]||0)),0)}

  const confirmReturn=async()=>{
    if(!selOrder)return
    const returnItems=(selOrder.items||[]).map((it,i)=>({name:it.name,nameEn:it.nameEn,qty:retQtys[i]||0,price:it.price})).filter(it=>it.qty>0)
    const amt=returnItems.reduce((s,it)=>s+it.price*it.qty,0)
    const nr={id:genId(),num:counter,status:"مرتجع",amount:amt,time:nowStr(),type:selOrder.type,items:returnItems,discount:0,tax:amt*TAX_F,payMethod:retMethod,returnReason:retReason,originalId:selOrder.id}
    setOrders(prev=>[nr,...prev]);setCounter(n=>n+1);await dbSaveOrder(nr,userId);setReturnStep(3)
  }

  const settleActiveOrder=async(method)=>{
    if(!selOrder)return
    setOrders(prev=>prev.map(o=>o.id===selOrder.id?{...o,status:"تم",payMethod:method,time:nowStr()}:o))
    await dbUpdateOrderStatus(selOrder.id,"تم",method)
    setSettleModal(false);setSettleMethod("");setModal(null);pop("✅ Order settled")
  }

  const handleLogout=async()=>await supabase.auth.signOut()

  const CartPanel=()=>(
    <div style={{width:isMobile?"100%":300,borderLeft:"1px solid #E5E7EB",background:"#fff",display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"12px 16px",borderBottom:"1px solid #E5E7EB",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:11,color:"#9CA3AF"}}>{orderType}</span>
        <span style={{fontWeight:700,fontSize:14}}>🛒 Current Order</span>
      </div>
      <div style={{flex:1,overflow:"auto"}}>
        {cart.length===0?(
          <div style={{textAlign:"center",padding:32,color:"#9CA3AF"}}><div style={{fontSize:36,marginBottom:8}}>🛒</div><div style={{fontSize:13}}>Cart is empty</div></div>
        ):cart.map(item=>(
          <div key={item.id} style={{padding:"10px 16px",borderBottom:"1px solid #F9FAFB"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13}}>{item.e} {item.nameEn}</div>
                <div style={{fontSize:10,color:"#9CA3AF"}}>{item.name}</div>
                <div style={{fontSize:11,color:"#9CA3AF"}}>{fmt(item.price)} × {item.qty}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <button onClick={()=>updQty(item.id,-1)} style={{background:P,color:"#fff",border:"none",borderRadius:6,width:24,height:24,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                <span style={{fontWeight:700,minWidth:20,textAlign:"center"}}>{item.qty}</span>
                <button onClick={()=>updQty(item.id,1)} style={{background:P,color:"#fff",border:"none",borderRadius:6,width:24,height:24,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                <button onClick={()=>updQty(item.id,-999)} style={{background:"none",border:"none",color:"#EF4444",cursor:"pointer",fontSize:12}}>✕</button>
              </div>
            </div>
          </div>
        ))}
        {notes&&<div style={{padding:"8px 16px",background:"#FFFBEB",borderTop:"1px solid #FEF3C7"}}><span style={{fontSize:11,color:"#92400E",fontWeight:600}}>📝 {notes}</span></div>}
      </div>
      <div style={{padding:"12px 16px",borderTop:"1px solid #E5E7EB"}}>
        {discAmt>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span style={{color:"#10B981",fontWeight:700}}>- {fmt(discAmt)}</span><span style={{color:"#6B7280"}}>{discount?.name||"Discount"}</span></div>}
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:8,color:"#9CA3AF"}}><span>{fmt(taxExtract)}</span><span>VAT 15% included</span></div>
        {screen==="main"?(
          <button disabled={!cart.length} onClick={()=>setScreen("payment")} style={{background:cart.length?grad:"#E5E7EB",color:"#fff",border:"none",borderRadius:12,padding:"14px",width:"100%",fontSize:16,fontWeight:900,cursor:cart.length?"pointer":"not-allowed",display:"flex",justifyContent:"space-between",boxShadow:cart.length?"0 4px 14px rgba(124,58,237,.4)":"none",transition:"all .2s",marginTop:4}}>
            <span>{fmt(grandTotal)}</span><span>Total</span>
          </button>
        ):(
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:"1px solid #E5E7EB",marginTop:4}}>
            <span style={{fontWeight:900,fontSize:17,color:P}}>{fmt(grandTotal)}</span>
            <span style={{fontWeight:700,fontSize:17}}>Total</span>
          </div>
        )}
      </div>
    </div>
  )

  const TB=({icon,label,onClick})=>(
    <button onClick={onClick} style={{background:P,color:"#fff",border:"none",borderRadius:10,padding:"7px 11px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:54,fontSize:11,fontWeight:600,boxShadow:"0 2px 8px rgba(124,58,237,.25)"}}>
      <span style={{fontSize:16}}>{icon}</span><span>{label}</span>
    </button>
  )

  const MainToolbar=()=>(
    <div style={{background:"#fff",padding:"8px 12px",display:"flex",gap:6,borderBottom:"1px solid #E5E7EB",flexWrap:"wrap",alignItems:"center"}}>
      <TB icon="🖨️" label="Print"    onClick={()=>pop("Sent to printer")}/>
      <TB icon="👨‍🍳" label="Kitchen"  onClick={()=>pop("Sent to kitchen")}/>
      <TB icon="🚫" label="Cancel"   onClick={()=>cart.length?setModal("cancel"):pop("No active order")}/>
      <TB icon="🏷️" label="Discount" onClick={()=>cart.length?setModal("discountChoice"):pop("Add items first")}/>
      <TB icon="📝" label="Notes"    onClick={()=>setModal("notes")}/>
      <div style={{marginRight:"auto",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:11,color:"#9CA3AF"}}>{session?.user?.email}</span>
        <button onClick={handleLogout} style={{background:"#EF4444",color:"#fff",border:"none",borderRadius:10,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:700}}>Logout</button>
      </div>
    </div>
  )

  const BackBar=({title,onBack,extra})=>(
    <div style={{background:"#fff",padding:"10px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid #E5E7EB"}}>
      <button style={{background:PL,color:P,border:"none",borderRadius:12,padding:"10px 22px",cursor:"pointer",fontWeight:700,fontSize:15,minWidth:90}} onClick={onBack}>← Back</button>
      {title&&<span style={{fontWeight:700,fontSize:15,flex:1,textAlign:"center"}}>{title}</span>}
      {extra}
    </div>
  )

  const BottomNav=()=>(
    <div style={{background:"#fff",borderTop:"1px solid #E5E7EB",display:"flex",justifyContent:"space-around",padding:"8px 0"}}>
      {[{icon:"🏠",label:"Home",sc:"main"},{icon:"🕐",label:"Orders",sc:"orders"},{icon:"📊",label:"Report",sc:"report"},{icon:"➕",label:"New",sc:"new"}].map(({icon,label,sc})=>(
        <button key={label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 16px",cursor:"pointer",background:"none",border:"none",color:screen===sc?P:"#9CA3AF",fontSize:11,fontWeight:screen===sc?700:400}}
          onClick={()=>sc==="new"?suspendCart():setScreen(sc)}>
          <span style={{fontSize:20}}>{icon}</span><span>{label}</span>
        </button>
      ))}
    </div>
  )

  const MainScreen=()=>(
    <>
      <MainToolbar/>
      <div style={{flex:1,overflow:"auto",padding:16}}>
        <div style={{position:"relative",marginBottom:14}}>
          <span style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",color:P,fontSize:16}}>🔍</span>
          <input style={{width:"100%",padding:"10px 42px 10px 14px",border:`1.5px solid ${search?P:"#E5E7EB"}`,borderRadius:12,fontSize:14,direction:"ltr",textAlign:"left",boxSizing:"border-box",background:"#fff",outline:"none"}} placeholder="Search products..." value={search} onChange={e=>{setSearch(e.target.value);if(e.target.value)setActiveCat(null)}}/>
          {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#9CA3AF",cursor:"pointer",fontSize:16}}>✕</button>}
        </div>
        {!activeCat&&!search&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
            {CATS.map(cat=>(
              <div key={cat.id} onClick={()=>setActiveCat(cat.id)} style={{background:"#fff",border:"1.5px solid #E5E7EB",borderBottom:`4px solid ${P}`,borderRadius:14,padding:"18px 10px 14px",cursor:"pointer",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
                <div style={{fontSize:26,marginBottom:6}}>{cat.icon}</div>
                <div style={{fontWeight:700,fontSize:11,color:"#374151"}}>{cat.name}</div>
                <div style={{fontSize:9,color:"#9CA3AF",marginTop:2}}>{cat.nameAr}</div>
                <div style={{fontSize:10,color:P,marginTop:3,fontWeight:600}}>{(PRODS[cat.id]||[]).length} items</div>
              </div>
            ))}
          </div>
        )}
        {(activeCat||search)&&(
          <div>
            {activeCat&&(
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <button onClick={()=>setActiveCat(null)} style={{background:PL,color:P,border:"none",borderRadius:12,padding:"10px 22px",cursor:"pointer",fontWeight:700,fontSize:15,minWidth:90}}>← Back</button>
                <span style={{fontWeight:700,color:"#374151",fontSize:15}}>{CATS.find(c=>c.id===activeCat)?.name}</span>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
              {filtProds.map(p=>{const inCart=cart.find(i=>i.id===p.id);return(
                <div key={p.id} onClick={()=>addToCart(p)} style={{background:inCart?PL:"#fff",border:`1.5px solid ${inCart?P:"#E5E7EB"}`,borderRadius:14,padding:"14px 10px",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all .15s"}}>
                  <div style={{fontSize:22}}>{p.e}</div>
                  <div style={{fontWeight:700,fontSize:11,color:"#1F2937"}}>{p.nameEn}</div>
                  <div style={{fontSize:9,color:"#9CA3AF"}}>{p.name}</div>
                  <div style={{fontWeight:900,color:P,fontSize:13}}>{fmt(p.price)}</div>
                  <div style={{fontSize:9,color:"#C4B5FD"}}>incl. VAT</div>
                  {inCart&&<div style={{background:P,color:"#fff",borderRadius:20,padding:"1px 10px",fontSize:11,fontWeight:700}}>×{inCart.qty}</div>}
                </div>
              )})}
            </div>
          </div>
        )}
      </div>
      <BottomNav/>
    </>
  )

  const PaymentScreen=()=>{
    const METHODS=[{k:"كاش",icon:"💵",label:"Cash"},{k:"بطاقة",icon:"💳",label:"Card"},{k:"تحويل",icon:"🔄",label:"Transfer"}]
    const addSplit=()=>{
      const amt=parseFloat(splitInput)
      if(!splitMethod||!amt||amt<=0)return
      if(splitMethod!=="كاش"&&amt>splitRemaining){alert(`Amount exceeds remaining (${fmt(splitRemaining)})`);return}
      setSplitPayments(prev=>[...prev,{method:splitMethod,amount:amt}])
      setSplitMethod(null);setSplitInput("")
    }
    const removeSplit=(i)=>setSplitPayments(prev=>prev.filter((_,idx)=>idx!==i))
    const cashEntry=splitPayments.find(p=>p.method==="كاش")
    const changeAmt=cashEntry&&splitPaid>grandTotal?splitPaid-grandTotal:0
    return(
      <>
        <BackBar onBack={()=>setScreen("main")} extra={<div style={{marginRight:"auto"}}><button style={{background:"#6B7280",color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:13}} onClick={()=>setModal("customerList")}>Customer</button></div>}/>
        <div style={{flex:1,overflow:"auto",padding:20,maxWidth:500,margin:"0 auto",width:"100%"}}>
          <div style={{background:splitComplete?"#F0FDF4":PL,borderRadius:14,padding:"14px 18px",marginBottom:16,border:`2px solid ${splitComplete?"#BBF7D0":PL}`,transition:"all .3s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{fontWeight:900,fontSize:20,color:splitComplete?"#065F46":P}}>{fmt(grandTotal)}</span>
              <span style={{fontWeight:600,color:"#6B7280",fontSize:13}}>Order Total</span>
            </div>
            {discAmt>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#6B7280",marginBottom:4}}><span>- {fmt(discAmt)}</span><span>Discount</span></div>}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#8B5CF6",marginBottom:8}}><span>{fmt(taxExtract)}</span><span>VAT 15% included</span></div>
            {splitPayments.length>0&&<>
              <div style={{borderTop:"1px solid #E5E7EB",paddingTop:8,marginTop:4}}>
                {splitPayments.map((p,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <button onClick={()=>removeSplit(i)} style={{background:"#FEE2E2",border:"none",borderRadius:6,padding:"2px 8px",color:"#EF4444",cursor:"pointer",fontSize:11,fontWeight:700}}>Remove</button>
                    <span style={{fontWeight:600,fontSize:13}}>{p.method==="كاش"?"💵 Cash":p.method==="بطاقة"?"💳 Card":"🔄 Transfer"} — {fmt(p.amount)}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid #E5E7EB",paddingTop:8,marginTop:4}}>
                <span style={{fontWeight:900,fontSize:15,color:splitComplete?"#065F46":"#EF4444"}}>{fmt(splitRemaining)}</span>
                <span style={{fontWeight:700,color:"#6B7280",fontSize:13}}>{splitComplete?"✅ Payment complete":"Remaining"}</span>
              </div>
            </>}
            {changeAmt>0&&<div style={{marginTop:8,background:"#ECFDF5",borderRadius:10,padding:"8px 12px",display:"flex",justifyContent:"space-between"}}>
              <span style={{fontWeight:900,color:"#065F46",fontSize:16}}>{fmt(changeAmt)}</span>
              <span style={{fontSize:12,color:"#065F46"}}>Change for customer</span>
            </div>}
          </div>
          {!splitComplete&&<>
            <div style={{fontWeight:700,fontSize:14,marginBottom:10,color:"#374151"}}>Add Payment Method</div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {METHODS.map(m=>(
                <button key={m.k} onClick={()=>setSplitMethod(m.k)} style={{flex:1,padding:"12px 8px",border:`2px solid ${splitMethod===m.k?P:"#E5E7EB"}`,borderRadius:12,background:splitMethod===m.k?PL:"#fff",color:splitMethod===m.k?P:"#374151",fontWeight:700,cursor:"pointer",fontSize:13,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <span style={{fontSize:20}}>{m.icon}</span><span>{m.label}</span>
                </button>
              ))}
            </div>
            {splitMethod&&<>
              <div style={{fontWeight:700,fontSize:13,marginBottom:8,color:"#374151"}}>Amount — Remaining: <span style={{color:P}}>{fmt(splitRemaining)}</span></div>
              {splitMethod==="كاش"&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:10}}>
                {[10,20,50,100,200,splitRemaining].map((a,i)=>(
                  <button key={i} onClick={()=>setSplitInput(String(a))} style={{padding:"10px",border:`2px solid ${parseFloat(splitInput)===a?P:"#E5E7EB"}`,borderRadius:10,background:parseFloat(splitInput)===a?PL:"#fff",fontWeight:700,cursor:"pointer",fontSize:i===5?10:14,color:i===5?P:"#1F2937"}}>
                    {i===5?`Full (${fmt(a)})`:fmt(a)}
                  </button>
                ))}
              </div>}
              {splitMethod!=="كاش"&&<button onClick={()=>setSplitInput(String(splitRemaining))} style={{background:PL,border:`1.5px solid ${P}`,borderRadius:10,padding:"10px",width:"100%",color:P,fontWeight:700,cursor:"pointer",fontSize:13,marginBottom:8}}>
                Full remaining — {fmt(splitRemaining)}
              </button>}
              <div style={{display:"flex",gap:8}}>
                <button onClick={addSplit} disabled={!splitInput||parseFloat(splitInput)<=0} style={{background:splitInput&&parseFloat(splitInput)>0?grad:"#E5E7EB",color:"#fff",border:"none",borderRadius:10,padding:"12px 20px",cursor:splitInput?"pointer":"not-allowed",fontWeight:700,fontSize:14,whiteSpace:"nowrap"}}>Add +</button>
                <input type="number" value={splitInput} onChange={e=>setSplitInput(e.target.value)} placeholder="Enter amount" style={{flex:1,padding:"12px",border:`1.5px solid ${P}`,borderRadius:10,fontSize:15,textAlign:"center",outline:"none"}} onKeyDown={e=>e.key==="Enter"&&addSplit()}/>
              </div>
            </>}
          </>}
          <button disabled={!splitComplete} onClick={finishPayment} style={{background:splitComplete?grad:"#E5E7EB",color:"#fff",border:"none",borderRadius:12,padding:"16px",width:"100%",fontSize:16,fontWeight:900,cursor:splitComplete?"pointer":"not-allowed",marginTop:20,boxShadow:splitComplete?"0 4px 14px rgba(124,58,237,.4)":"none",transition:"all .3s"}}>
            {splitComplete?`✅ Complete Payment — ${fmt(grandTotal)}`:`Complete payment — ${fmt(splitRemaining)} remaining`}
          </button>
        </div>
      </>
    )
  }

  const OrdersScreen=()=>{
    const sc={نشط:{bg:"#D1FAE5",c:"#065F46"},تم:{bg:"#EDE9FE",c:"#5B21B6"},ملغى:{bg:"#FEE2E2",c:"#991B1B"},معلق:{bg:"#FEF3C7",c:"#92400E"},مرتجع:{bg:"#FFF7ED",c:"#C2410C"}}
    const sl={نشط:"Active",تم:"Done",ملغى:"Cancelled",معلق:"Pending",مرتجع:"Returned"}
    return(
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
          <div style={{background:"#fff",padding:"8px 12px",display:"flex",gap:8,borderBottom:"1px solid #E5E7EB",alignItems:"center"}}>
            <button style={{background:"#6B7280",color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:13}} onClick={()=>setScreen("main")}>← Back</button>
            <div style={{marginRight:"auto",display:"flex",gap:8}}>
              {selOrderId&&<button style={{background:P,color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:13}} onClick={()=>setModal("orderOptions")}>More</button>}
              <button style={{background:P,color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:13}} onClick={()=>{loadOrders();pop("🔄 Synced")}}>Sync</button>
            </div>
          </div>
          <div style={{background:"#fff",padding:"8px 12px",borderBottom:"1px solid #E5E7EB"}}>
            <input style={{width:"100%",padding:"9px 14px",border:"1.5px solid #E5E7EB",borderRadius:10,fontSize:14,boxSizing:"border-box",marginBottom:8}} placeholder="Search orders..." value={ordSearch} onChange={e=>setOrdSearch(e.target.value)}/>
            <div style={{display:"flex"}}>
              {[{l:"All",f:"الكل"},{l:"Active",f:"نشط"},{l:"Done",f:"تم"},{l:"Cancelled",f:"ملغى"},{l:"Returned",f:"مرتجع"}].map(({l,f})=>(
                <button key={f} onClick={()=>setOrdTab(f)} style={{flex:1,padding:"8px 4px",background:"none",border:"none",borderBottom:`3px solid ${ordTab===f?P:"transparent"}`,color:ordTab===f?P:"#6B7280",fontWeight:ordTab===f?700:400,cursor:"pointer",fontSize:11}}>
                  {l}{f==="الكل"?` (${orders.length})`:f==="نشط"&&activeCount>0?` (${activeCount})`:""}
                </button>
              ))}
            </div>
          </div>
          {loadingOrders?(
            <div style={{textAlign:"center",padding:32,color:"#9CA3AF"}}>Loading...</div>
          ):(
            <div style={{flex:1,overflow:"auto"}}>
              {filtOrders.map(o=>{
                const s=sc[o.status]||{bg:"#F3F4F6",c:"#374151"}
                const isSel=o.id===selOrderId
                return(
                  <div key={o.id} style={{padding:"14px 16px",borderBottom:"1px solid #F3F4F6",cursor:"pointer",background:isSel?PL:"transparent",display:"flex",justifyContent:"space-between",borderRight:isSel?`4px solid ${P}`:"4px solid transparent"}}
                    onClick={()=>setSelOrderId(isSel?null:o.id)}>
                    <div>
                      <div style={{fontWeight:700,fontSize:14}}>#{o.num}</div>
                      <div style={{color:"#6B7280",fontSize:12,marginTop:2}}>{o.type}</div>
                      <div style={{color:"#9CA3AF",fontSize:11}}>{o.time}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <span style={{display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:s.bg,color:s.c}}>{sl[o.status]||o.status}</span>
                      <div style={{fontWeight:700,marginTop:4,color:P}}>{fmt(o.amount)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        {selOrder&&(
          <div style={{width:260,background:"#F9FAFB",borderLeft:"1px solid #E5E7EB",display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid #E5E7EB",background:"#fff"}}>
              <div style={{fontWeight:700,fontSize:14}}>Order #{selOrder.num}</div>
              <div style={{fontSize:11,color:"#9CA3AF"}}>{selOrder.time} · {selOrder.type}</div>
              {selOrder.customer&&<div style={{fontSize:11,color:P,marginTop:2}}>👤 {selOrder.customer}</div>}
            </div>
            <div style={{flex:1,overflow:"auto",padding:"8px 12px"}}>
              {(selOrder.items||[]).map((it,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #E5E7EB",fontSize:12}}>
                  <div>
                    <div style={{fontWeight:600}}>{it.nameEn||it.name}</div>
                    <div style={{fontSize:10,color:"#9CA3AF"}}>× {it.qty} · {fmt(it.price)}</div>
                  </div>
                  <div style={{fontWeight:700,color:P}}>{fmt(it.price*it.qty)}</div>
                </div>
              ))}
            </div>
            <div style={{padding:"10px 12px",borderTop:"1px solid #E5E7EB",background:"#fff"}}>
              {selOrder.discount>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#EF4444",marginBottom:3}}><span>Discount</span><span>- {fmt(selOrder.discount)}</span></div>}
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#8B5CF6",marginBottom:3}}><span>VAT</span><span>{fmt(selOrder.tax||0)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:14}}><span>Total</span><span style={{color:P}}>{fmt(selOrder.amount)}</span></div>
              <div style={{fontSize:10,color:"#6B7280",marginTop:3}}>{selOrder.payMethod}</div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const ReportScreen=()=>{
    if(activeCount>0)return(
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
        <div style={{fontWeight:700,fontSize:18,color:"#92400E",marginBottom:8}}>Cannot generate report</div>
        <div style={{color:"#6B7280",marginBottom:24}}>There are <strong style={{color:P}}>{activeCount}</strong> active orders</div>
        <button style={{background:grad,color:"#fff",border:"none",borderRadius:12,padding:"12px 28px",cursor:"pointer",fontWeight:700,fontSize:15}} onClick={()=>{setScreen("orders");setOrdTab("نشط")}}>View Active Orders</button>
        <button style={{marginTop:12,background:"none",border:"none",color:"#6B7280",cursor:"pointer",fontWeight:600}} onClick={()=>setScreen("main")}>Back</button>
      </div>
    )
    const done=orders.filter(o=>o.status==="تم")
    const rev=done.reduce((s,o)=>s+o.amount,0)
    const tax=done.reduce((s,o)=>s+(o.tax||0),0)
    const disc=done.reduce((s,o)=>s+(o.discount||0),0)
    return(
      <>
        <BackBar title="Daily Report" onBack={()=>setScreen("main")}/>
        <div style={{flex:1,overflow:"auto",padding:20}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
            {[{l:"Total Sales",v:fmt(rev),c:"#10B981"},{l:"Orders",v:done.length,c:P},{l:"VAT 15%",v:fmt(tax),c:"#F59E0B"},{l:"Discounts",v:fmt(disc),c:"#EF4444"}].map(({l,v,c})=>(
              <div key={l} style={{background:"#fff",borderRadius:14,padding:"16px",boxShadow:"0 2px 8px rgba(0,0,0,.05)",borderTop:`4px solid ${c}`}}>
                <div style={{fontWeight:900,fontSize:20,color:c}}>{v}</div>
                <div style={{fontSize:12,color:"#6B7280",marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#fff",borderRadius:14,padding:16,boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
            <div style={{fontWeight:700,marginBottom:12}}>Payment Methods</div>
            {[{k:"كاش",l:"Cash"},{k:"بطاقة",l:"Card"},{k:"تحويل",l:"Transfer"}].map(({k,l})=>{
              const mo=done.filter(o=>o.payMethod===k||o.payMethod?.includes(k))
              return mo.length>0?(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F3F4F6",fontSize:14}}>
                  <span style={{fontWeight:700,color:P}}>{fmt(mo.reduce((s,o)=>s+o.amount,0))}</span>
                  <span style={{color:"#374151"}}>{l} ({mo.length})</span>
                </div>
              ):null
            })}
          </div>
        </div>
      </>
    )
  }

  const OrderTypeModal=()=>(
    <div style={ov} onClick={()=>setShowTypeModal(false)}>
      <div style={{...mod,maxWidth:360}} onClick={e=>e.stopPropagation()}>
        <div style={{fontWeight:700,fontSize:16,marginBottom:20,textAlign:"center"}}>Order Type</div>
        {ORDER_TYPES.map(t=>(
          <button key={t.key} onClick={()=>{setOrderType(t.key);setShowTypeModal(false)}} style={{background:"#fff",border:`2px solid ${orderType===t.key?P:"#E5E7EB"}`,borderRadius:12,padding:"14px 18px",cursor:"pointer",width:"100%",textAlign:"right",fontSize:15,fontWeight:600,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:orderType===t.key?"0 0 0 3px "+PL:"none"}}>
            <span style={{color:"#9CA3AF",fontSize:13}}>{t.key}</span>
            <span>{t.icon} {t.label}</span>
          </button>
        ))}
      </div>
    </div>
  )

  const DiscountChoiceModal=()=>(
    <div style={ov} onClick={()=>setModal(null)}>
      <div style={{...mod}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <button style={lnk()} onClick={()=>setModal(null)}>✕</button>
          <span style={{fontWeight:700,fontSize:16}}>Discount Type</span>
        </div>
        {DISCOUNTS.map(d=>(
          <button key={d.id} onClick={()=>{setDiscount({name:d.name,type:"pct",value:d.pct});setModal(null);pop(`✅ ${d.pct}% — ${d.name}`)}} style={{background:"#fff",border:`2px solid ${d.color}20`,borderRight:`6px solid ${d.color}`,borderRadius:12,padding:"14px 18px",cursor:"pointer",width:"100%",textAlign:"right",fontSize:14,fontWeight:600,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:d.color,fontWeight:900}}>{d.pct}%</span>
            <span>{d.name}</span>
          </button>
        ))}
        <button onClick={()=>setModal("discountInput")} style={{background:PL,border:`2px solid ${P}`,borderRadius:12,padding:"14px 18px",cursor:"pointer",width:"100%",textAlign:"center",fontSize:14,fontWeight:700,color:P,marginTop:4}}>Custom Discount ✏️</button>
        {discount&&<button onClick={()=>{setDiscount(null);setModal(null);pop("❌ Discount removed")}} style={{background:"#FEE2E2",border:"none",borderRadius:12,padding:"12px",cursor:"pointer",width:"100%",fontSize:13,fontWeight:700,color:"#991B1B",marginTop:8}}>Remove Current Discount</button>}
      </div>
    </div>
  )

  const DiscountInputModal=()=>(
    <div style={ov} onClick={()=>setModal(null)}>
      <div style={{...mod}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <button style={lnk()} onClick={()=>setModal(null)}>✕</button>
          <span style={{fontWeight:700,fontSize:16}}>Custom Discount</span>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {["amount","pct"].map(t=>(
            <button key={t} onClick={()=>setDiscType(t)} style={{flex:1,padding:"10px",border:`2px solid ${discType===t?P:"#E5E7EB"}`,borderRadius:10,background:discType===t?PL:"#fff",color:discType===t?P:"#374151",fontWeight:700,cursor:"pointer",fontSize:14}}>{t==="amount"?"Amount ﷼":"Percent %"}</button>
          ))}
        </div>
        <input type="number" value={discInput} onChange={e=>setDiscInput(e.target.value)} placeholder={discType==="amount"?"e.g. 10":"e.g. 15"} style={{width:"100%",padding:"12px",border:`1.5px solid ${P}`,borderRadius:10,fontSize:16,textAlign:"center",marginBottom:16,outline:"none"}}/>
        <button onClick={()=>{if(!discInput)return;setDiscount({name:`Discount ${discInput}${discType==="pct"?"%":"﷼"}`,type:discType,value:discInput});setDiscInput("");setModal(null);pop("✅ Discount applied")}} style={{background:grad,color:"#fff",border:"none",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:"pointer"}}>Apply</button>
      </div>
    </div>
  )

  const CancelModal=()=>{
    const reasons=["Wrong order","Product unavailable","Customer changed mind","Other"]
    const [sel,setSel]=useState("")
    return(
      <div style={ov} onClick={()=>setModal(null)}>
        <div style={{...mod}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <button style={lnk()} onClick={()=>setModal(null)}>✕</button>
            <span style={{fontWeight:700,fontSize:16}}>Cancel Reason</span>
          </div>
          {reasons.map(r=>(
            <button key={r} onClick={()=>setSel(r)} style={{background:sel===r?PL:"#fff",border:`2px solid ${sel===r?P:"#E5E7EB"}`,borderRadius:12,padding:"12px 16px",cursor:"pointer",width:"100%",textAlign:"right",fontSize:14,fontWeight:600,marginBottom:8}}>{r}</button>
          ))}
          <button disabled={!sel} onClick={()=>cancelOrder(sel)} style={{background:sel?"#EF4444":"#E5E7EB",color:"#fff",border:"none",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:sel?"pointer":"not-allowed",marginTop:8}}>Cancel Order</button>
        </div>
      </div>
    )
  }

  const CustomerListModal=()=>(
    <div style={ov} onClick={()=>setModal(null)}>
      <div style={{...mod}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <button style={lnk()} onClick={()=>setModal(null)}>✕</button>
          <span style={{fontWeight:700,fontSize:16}}>Select Customer</span>
        </div>
        {CUSTOMERS.map(c=>(
          <div key={c.id} onClick={()=>{setCustomer(c);setModal(null);pop(`✅ ${c.name}`)}} style={{padding:"12px 16px",borderBottom:"1px solid #F3F4F6",cursor:"pointer",display:"flex",justifyContent:"space-between",background:customer?.id===c.id?PL:"transparent",borderRadius:8}}>
            <span style={{color:"#9CA3AF",fontSize:12}}>{c.phone}</span>
            <span style={{fontWeight:600}}>{c.name}</span>
          </div>
        ))}
        {customer&&<button onClick={()=>{setCustomer(null);setModal(null)}} style={{background:"#FEE2E2",border:"none",borderRadius:10,padding:"10px",width:"100%",color:"#991B1B",fontWeight:700,marginTop:8,cursor:"pointer"}}>Remove Customer</button>}
      </div>
    </div>
  )

  const NotesModal=()=>(
    <div style={ov} onClick={()=>setModal(null)}>
      <div style={{...mod}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <button style={lnk()} onClick={()=>setModal(null)}>✕</button>
          <span style={{fontWeight:700,fontSize:16}}>Order Notes</span>
        </div>
        <textarea value={notesInput} onChange={e=>setNotesInput(e.target.value)} placeholder="Write notes here..." style={{width:"100%",padding:"12px",border:`1.5px solid #E5E7EB`,borderRadius:10,fontSize:14,minHeight:120,resize:"vertical",outline:"none"}}/>
        <button onClick={()=>{setNotes(notesInput);setModal(null);pop("✅ Notes saved")}} style={{background:grad,color:"#fff",border:"none",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:12}}>Save</button>
      </div>
    </div>
  )

  const OrderOptionsModal=()=>{
    if(!selOrder)return null
    return(
      <div style={ov} onClick={()=>setModal(null)}>
        <div style={{...mod}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <button style={lnk()} onClick={()=>setModal(null)}>✕</button>
            <span style={{fontWeight:700,fontSize:16}}>Order #{selOrder.num}</span>
          </div>
          {selOrder.status==="نشط"&&<button onClick={()=>{setSettleModal(true);setModal(null)}} style={{background:grad,color:"#fff",border:"none",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:10}}>💳 Settle Order</button>}
          {selOrder.status==="تم"&&<button onClick={()=>{setReturnStep(1);setRetQtys({});setRetReason("");setRetMethod("");setModal(null)}} style={{background:"#FFF7ED",color:"#C2410C",border:"2px solid #FED7AA",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:10}}>↩ Return Order</button>}
          <button onClick={()=>{setInvoiceOrder(selOrder);setModal(null)}} style={{background:"#F0FDF4",color:"#065F46",border:"2px solid #BBF7D0",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:10}}>🧾 View Invoice</button>
          <button onClick={()=>{pop("🖨️ Printing...");setModal(null)}} style={{background:"#EFF6FF",color:"#1D4ED8",border:"2px solid #BFDBFE",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:10}}>🖨️ Print Invoice</button>
          <button onClick={()=>setModal(null)} style={{background:"#F5F3FF",color:P,border:`2px solid ${PL}`,borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:"pointer"}}>📋 Order Details</button>
        </div>
      </div>
    )
  }

  const ReturnStep1=()=>{
    if(!selOrder)return null
    const items=selOrder.items||[]
    const allSel=items.every((it,i)=>(retQtys[i]||0)===it.qty)
    return(
      <div style={ov}>
        <div style={{...mod}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <button style={lnk()} onClick={()=>setReturnStep(0)}>✕</button>
            <span style={{fontWeight:700,fontSize:15}}>Select Items to Return</span>
            <button onClick={()=>{
              if(allSel)setRetQtys({})
              else{const q={};items.forEach((it,i)=>{q[i]=it.qty});setRetQtys(q)}
            }} style={{background:allSel?PL:"#F3F4F6",border:`1.5px solid ${allSel?P:"#E5E7EB"}`,borderRadius:8,padding:"6px 14px",cursor:"pointer",fontWeight:700,fontSize:12,color:allSel?P:"#374151"}}>
              {allSel?"Clear All":"Select All"}
            </button>
          </div>
          {items.map((item,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #F3F4F6"}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <button onClick={()=>setRetQtys(q=>({...q,[i]:Math.min((q[i]||0)+1,item.qty)}))} style={{background:P,color:"#fff",border:"none",borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:14}}>+</button>
                <span style={{fontWeight:700,minWidth:24,textAlign:"center"}}>{retQtys[i]||0}</span>
                <button onClick={()=>setRetQtys(q=>({...q,[i]:Math.max((q[i]||0)-1,0)}))} style={{background:"#6B7280",color:"#fff",border:"none",borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:14}}>−</button>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontWeight:600,fontSize:13}}>{item.nameEn||item.name}</div>
                <div style={{fontSize:11,color:"#9CA3AF"}}>Qty: {item.qty} · {fmt(item.price)}</div>
              </div>
            </div>
          ))}
          <div style={{marginTop:16,padding:"12px",background:PL,borderRadius:10,textAlign:"center",fontWeight:700,color:P,fontSize:16}}>{fmt(retTotal())}</div>
          <button disabled={retTotal()===0} onClick={()=>setReturnStep(2)} style={{background:retTotal()>0?grad:"#E5E7EB",color:"#fff",border:"none",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:retTotal()>0?"pointer":"not-allowed",marginTop:12}}>Next</button>
        </div>
      </div>
    )
  }

  const ReturnStep2=()=>{
    const reasons=["Wrong order","Product unavailable"]
    const methods=["Cash 💵","Card 💳"]
    return(
      <div style={ov}>
        <div style={{...mod}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <button style={lnk()} onClick={()=>setReturnStep(1)}>← Back</button>
            <span style={{fontWeight:700,fontSize:16}}>Return Reason & Method</span>
          </div>
          <div style={{fontWeight:700,marginBottom:8,fontSize:13}}>Reason</div>
          {reasons.map(r=><button key={r} onClick={()=>setRetReason(r)} style={{background:retReason===r?PL:"#fff",border:`2px solid ${retReason===r?P:"#E5E7EB"}`,borderRadius:10,padding:"12px",width:"100%",textAlign:"right",cursor:"pointer",fontWeight:600,marginBottom:8,fontSize:14}}>{r}</button>)}
          <div style={{fontWeight:700,margin:"16px 0 8px",fontSize:13}}>Refund Method</div>
          {methods.map(m=><button key={m} onClick={()=>setRetMethod(m)} style={{background:retMethod===m?PL:"#fff",border:`2px solid ${retMethod===m?P:"#E5E7EB"}`,borderRadius:10,padding:"12px",width:"100%",textAlign:"right",cursor:"pointer",fontWeight:600,marginBottom:8,fontSize:14}}>{m}</button>)}
          <button disabled={!retReason||!retMethod} onClick={confirmReturn} style={{background:retReason&&retMethod?grad:"#E5E7EB",color:"#fff",border:"none",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:retReason&&retMethod?"pointer":"not-allowed",marginTop:8}}>Confirm Return</button>
        </div>
      </div>
    )
  }

  const ReturnStep3=()=>(
    <div style={ov}>
      <div style={{...mod,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>✅</div>
        <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>Return Successful</div>
        <div style={{color:"#6B7280",marginBottom:24}}>{fmt(retTotal())} — {retMethod}</div>
        <button onClick={()=>{setReturnStep(0);setSelOrderId(null)}} style={{background:grad,color:"#fff",border:"none",borderRadius:12,padding:"14px 32px",cursor:"pointer",fontWeight:700,fontSize:15}}>Done</button>
      </div>
    </div>
  )

  const SettleModal=()=>{
    if(!settleModal)return null
    return(
      <div style={ov}>
        <div style={{...mod}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <button style={lnk()} onClick={()=>{setSettleModal(false);setSettleMethod("")}}>✕</button>
            <span style={{fontWeight:700,fontSize:16}}>Settle Order</span>
          </div>
          {[{key:"كاش",icon:"💵",label:"Cash"},{key:"بطاقة",icon:"💳",label:"Card"},{key:"تحويل",icon:"🔄",label:"Transfer"}].map(m=>(
            <button key={m.key} onClick={()=>setSettleMethod(m.key)} style={{background:"#fff",border:`2px solid ${settleMethod===m.key?P:"#E5E7EB"}`,borderRight:`6px solid ${P}`,borderRadius:12,padding:"14px 18px",cursor:"pointer",width:"100%",textAlign:"right",fontSize:15,fontWeight:600,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:settleMethod===m.key?"0 0 0 3px "+PL:"none"}}>
              <span style={{color:"#9CA3AF",fontSize:13}}>{m.key}</span>
              <span>{m.icon} {m.label}</span>
            </button>
          ))}
          <button disabled={!settleMethod} onClick={()=>settleActiveOrder(settleMethod)} style={{background:settleMethod?grad:"#E5E7EB",color:"#fff",border:"none",borderRadius:12,padding:"15px",width:"100%",fontSize:16,fontWeight:900,cursor:settleMethod?"pointer":"not-allowed",marginTop:8}}>Settle ✓</button>
        </div>
      </div>
    )
  }

  const ChangeDialog=()=>{
    if(!changeDialog)return null
    return(
      <div style={{...ov,background:"rgba(0,0,0,.35)"}}>
        <div style={{background:"#fff",borderRadius:20,padding:"32px 40px",textAlign:"center",minWidth:300,maxWidth:360,boxShadow:"0 8px 40px rgba(0,0,0,.2)"}}>
          <div style={{fontWeight:700,fontSize:18,color:"#1F2937",marginBottom:20}}>Change for Customer</div>
          <div style={{fontWeight:900,fontSize:36,color:"#1F2937",marginBottom:32}}>{fmt(changeDialog.amount)}</div>
          <button onClick={()=>{setChangeDialog(null);pop("✅ Order completed")}} style={{background:"none",border:"none",color:P,fontWeight:700,fontSize:18,cursor:"pointer",width:"100%",padding:"10px"}}>OK</button>
        </div>
      </div>
    )
  }

  const MobileCartBtn=()=>{
    if(!isMobile||screen==="payment")return null
    return(
      <button onClick={()=>setShowMobileCart(true)} style={{position:"fixed",bottom:80,left:16,zIndex:150,background:grad,color:"#fff",border:"none",borderRadius:"50%",width:56,height:56,fontSize:22,cursor:"pointer",boxShadow:"0 4px 16px rgba(124,58,237,.5)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        🛒
        {cart.length>0&&<span style={{position:"absolute",top:-4,right:-4,background:"#EF4444",color:"#fff",borderRadius:"50%",width:20,height:20,fontSize:11,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>{cart.reduce((s,i)=>s+i.qty,0)}</span>}
      </button>
    )
  }

  const MobileCartOverlay=()=>{
    if(!isMobile||!showMobileCart)return null
    return(
      <div style={{position:"fixed",inset:0,zIndex:190,display:"flex",flexDirection:"column"}}>
        <div style={{flex:1,background:"rgba(0,0,0,.4)"}} onClick={()=>setShowMobileCart(false)}/>
        <div style={{background:"#fff",borderRadius:"20px 20px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #E5E7EB"}}>
            <button onClick={()=>{setShowMobileCart(false);setScreen("payment")}} disabled={!cart.length} style={{background:cart.length?grad:"#E5E7EB",color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",cursor:cart.length?"pointer":"not-allowed",fontWeight:700,fontSize:14}}>{fmt(grandTotal)} — Pay</button>
            <span style={{fontWeight:700,fontSize:16}}>🛒 Cart</span>
            <button onClick={()=>setShowMobileCart(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#374151"}}>✕</button>
          </div>
          <div style={{overflow:"auto",flex:1}}><CartPanel/></div>
        </div>
      </div>
    )
  }

  return(
    <div style={{fontFamily:"'Tajawal','Arial',sans-serif",direction:"rtl",display:"flex",height:"100vh",background:"#F5F3FF",overflow:"hidden",fontSize:14}}>
      {!isMobile&&<CartPanel/>}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {screen==="main"   &&<MainScreen/>}
        {screen==="payment"&&<PaymentScreen/>}
        {screen==="orders" &&<OrdersScreen/>}
        {screen==="report" &&<ReportScreen/>}
      </div>
      {showTypeModal&&<OrderTypeModal/>}
      {returnStep===1&&<ReturnStep1/>}
      {returnStep===2&&<ReturnStep2/>}
      {returnStep===3&&<ReturnStep3/>}
      {modal==="discountChoice"&&<DiscountChoiceModal/>}
      {modal==="discountInput" &&<DiscountInputModal/>}
      {modal==="cancel"        &&<CancelModal/>}
      {modal==="customerList"  &&<CustomerListModal/>}
      {modal==="notes"         &&<NotesModal/>}
      {modal==="orderOptions"  &&<OrderOptionsModal/>}
      <ChangeDialog/>
      <SettleModal/>
      <MobileCartBtn/>
      <MobileCartOverlay/>
      {invoiceOrder&&<Invoice order={invoiceOrder} onClose={()=>setInvoiceOrder(null)}/>}
      {toast&&<div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"#1F2937",color:"#fff",padding:"11px 22px",borderRadius:30,fontWeight:600,fontSize:13,zIndex:400,boxShadow:"0 6px 24px rgba(0,0,0,.3)",whiteSpace:"nowrap"}}>{toast}</div>}
    </div>
  )
}

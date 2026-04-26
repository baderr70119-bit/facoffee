import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

// ── Constants ─────────────────────────────────────────────────────────────────
const P="#7C3AED", PD="#5B21B6", PL="#EDE9FE", grad=`linear-gradient(135deg,#5B21B6,#7C3AED)`
const BRAND={name:"FA COFFEE",company:"شركة مدينة فارس الرياضية",branch:"فرع نوره رجالي",city:"الرياض - جامعة الأميرة نورة"}
const TAX_F=15/115
const fmt=(n)=>`﷼ ${Number(n).toFixed(2)}`
const nowStr=()=>new Date().toLocaleTimeString("ar-SA",{hour:"2-digit",minute:"2-digit"})+" م"
const ov={position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}
const mod={background:"#fff",borderRadius:18,padding:24,minWidth:320,maxWidth:440,width:"90%",maxHeight:"86vh",overflow:"auto"}
const lnk=(c=P)=>({background:"none",border:"none",color:c,cursor:"pointer",fontWeight:700,fontSize:14})

const CATS=[
  {id:"cold",  name:"COLD DRINK", nameAr:"مشروبات باردة",icon:"🧊"},
  {id:"hot",   name:"HOT DRINK",  nameAr:"مشروبات ساخنة",icon:"☕"},
  {id:"bakery",name:"BAKERY",     nameAr:"مخبوزات",       icon:"🥐"},
  {id:"sweet", name:"SWEET",      nameAr:"حلويات",         icon:"🍩"},
  {id:"icecream",name:"ICECREAM", nameAr:"آيس كريم",      icon:"🍦"},
  {id:"market",name:"FA MARKET",  nameAr:"FA بقالة",      icon:"🛍️"},
  {id:"drip",  name:"DRIP COFFEE",nameAr:"درب كوفي",      icon:"☕"},
]

const PRODS={
  cold:[
    {id:1, name:"سيجنتشر موهيتو",nameEn:"Signature Mojito", price:18,e:"🍹"},
    {id:2, name:"ايس امريكانو",  nameEn:"Iced Americano",   price:14,e:"☕"},
    {id:3, name:"ايس لاتيه",     nameEn:"Iced latte",       price:16,e:"🥛"},
    {id:4, name:"ايس سبانيش",    nameEn:"Iced spanish",     price:16,e:"🧋"},
    {id:5, name:"ماتشا",         nameEn:"Matcha",           price:18,e:"🍵"},
    {id:6, name:"كركديه",        nameEn:"Hibiscus",         price:14,e:"🌺"},
    {id:7, name:"ميكس بيري",     nameEn:"Mixed Berry",      price:16,e:"🫐"},
    {id:8, name:"باشن فروت",     nameEn:"Passion fruit",    price:16,e:"🍊"},
    {id:9, name:"بلو موهيتو",    nameEn:"Blue mojito",      price:14,e:"💙"},
    {id:10,name:"كوب وثلج",      nameEn:"Ice with cup",     price:2, e:"🧊"},
    {id:11,name:"ماء",           nameEn:"Water",            price:2, e:"💧"},
  ],
  hot:[
    {id:20,name:"سبانش لاتيه",      nameEn:"Spanish Latte",    price:18,e:"☕"},
    {id:21,name:"كابتشينو",         nameEn:"Cappuccino",       price:16,e:"☕"},
    {id:22,name:"كورتادو",          nameEn:"Cortado",          price:14,e:"☕"},
    {id:23,name:"ميكاتو",           nameEn:"Maciatol",         price:14,e:"☕"},
    {id:24,name:"اسبريسو",          nameEn:"Espresso",         price:12,e:"☕"},
    {id:25,name:"فلات وايت",        nameEn:"Flat White",       price:16,e:"☕"},
    {id:26,name:"نيرفانا كبير",     nameEn:"Big Nirvana",      price:18,e:"☕"},
    {id:27,name:"شاي احمر",         nameEn:"Red Tea",          price:10,e:"🍵"},
    {id:28,name:"هوت تشوكليت كبير", nameEn:"Big Hot Chocolate",price:20,e:"🍫"},
    {id:29,name:"لاتيه",            nameEn:"Latte",            price:16,e:"☕"},
    {id:30,name:"كرك",              nameEn:"Karak",            price:8, e:"🍵"},
    {id:31,name:"امريكانو حار",     nameEn:"Hot Americano",    price:12,e:"☕"},
  ],
  bakery:[
    {id:40,name:"ساندويتش الترك المدخن",nameEn:"Smoked turkey sandwich",price:28,e:"🥪"},
    {id:41,name:"ساندويتش دجاج",       nameEn:"Chicken sandwich",      price:26,e:"🥪"},
    {id:42,name:"ساندويتش تونة",        nameEn:"Tuna sandwich",         price:24,e:"🥪"},
    {id:43,name:"كوروسون لوز",          nameEn:"Almoned Croissant",     price:18,e:"🥐"},
    {id:44,name:"كوروسون تشوكليت",      nameEn:"Chocolate Croissant",   price:16,e:"🥐"},
    {id:45,name:"كوروسون زعترا",        nameEn:"Zaatar Croissant",      price:14,e:"🥐"},
    {id:46,name:"كوروسون جبن",          nameEn:"Cheese croissant",      price:14,e:"🥐"},
  ],
  sweet:[
    {id:50,name:"كيكة الماربل",       nameEn:"Marbel cake",          price:25,e:"🎂"},
    {id:51,name:"كيك السان سيبستيان", nameEn:"San sbestian cake",    price:28,e:"🍰"},
    {id:52,name:"تشيز كيك التوت",     nameEn:"Raspberry cheese cake",price:25,e:"🍓"},
    {id:53,name:"كوكيز",              nameEn:"Cookie",               price:12,e:"🍪"},
    {id:54,name:"كيكة دولتشي",        nameEn:"Dolche cake",          price:25,e:"🎂"},
    {id:55,name:"ترزل مانجو",         nameEn:"Mango travel",         price:25,e:"🥭"},
    {id:56,name:"كيكة التريفا",       nameEn:"Treva cake",           price:25,e:"🍰"},
    {id:57,name:"رايس كرسبي",         nameEn:"Rice crespy",          price:15,e:"🍡"},
    {id:58,name:"كيكة البيكان",       nameEn:"Pecan cake",           price:25,e:"🎂"},
    {id:59,name:"براونيز",            nameEn:"Brownies",             price:16,e:"🍫"},
    {id:60,name:"بنانا بودينق",       nameEn:"Banana boding",        price:18,e:"🍌"},
    {id:61,name:"مفن تشوكليت",        nameEn:"Chocolate muffin",     price:14,e:"🧁"},
  ],
  icecream:[
    {id:70,name:"ايسكريم فانيليا",          nameEn:"Vanilla Ice Cream",             price:14,e:"🍦"},
    {id:71,name:"ايسكريم مانجو",            nameEn:"Mango Ice Cream",               price:14,e:"🥭"},
    {id:72,name:"ايسكريم شوكولاته",         nameEn:"Chocolate Ice Cream",           price:14,e:"🍫"},
    {id:73,name:"ايسكريم شوكولاته فانيليا", nameEn:"Vanilla & chocolate Ice Cream", price:16,e:"🍦"},
    {id:74,name:"ايس كريم فانيليا بسكوت",  nameEn:"Biscuits vanilla ice cream",    price:18,e:"🍦"},
    {id:75,name:"ايس كريم شوكولاته بسكوت", nameEn:"Biscuits chocolate ice cream",  price:18,e:"🍫"},
    {id:76,name:"ايس كريم مانجو بسكوت",    nameEn:"Biscuits mango ice cream",      price:18,e:"🥭"},
    {id:77,name:"ايسكريم مانجو فانيليا",   nameEn:"Mango & Vanilla Ice Cream",     price:16,e:"🍦"},
    {id:78,name:"ميكس مانجو بسكوت",        nameEn:"Biscuits mango mix",            price:20,e:"🥭"},
    {id:79,name:"ميكس شوكولاته بسكوت",     nameEn:"Biscuits chocolate mix",        price:20,e:"🍫"},
  ],
  market:[
    {id:90, name:"دوريتوز سويت تشيلي",nameEn:"Doritos sweet chili",price:7, e:"🌶️"},
    {id:91, name:"كندر",             nameEn:"Kinder",             price:6, e:"🍫"},
    {id:92, name:"مارس",             nameEn:"Mars",               price:5, e:"🍫"},
    {id:93, name:"باونتي",           nameEn:"Bounty",             price:5, e:"🍫"},
    {id:94, name:"فلوتس",            nameEn:"Flutes",             price:5, e:"🍬"},
    {id:95, name:"كتكات",            nameEn:"Kit kat",            price:5, e:"🍫"},
    {id:96, name:"جالكسي",           nameEn:"Galaxy",             price:5, e:"🍫"},
    {id:97, name:"مالتيزرز",         nameEn:"Maltesers",          price:6, e:"🍫"},
    {id:98, name:"تويكس",            nameEn:"Twix",               price:5, e:"🍫"},
    {id:99, name:"M&M",              nameEn:"M&M",                price:6, e:"🍬"},
    {id:100,name:"شيبس ليز جبن",    nameEn:"Lays Cheese Chips",  price:5, e:"🥔"},
    {id:101,name:"شيبس ليز كتشب",   nameEn:"Lays Ketchup Chips", price:5, e:"🥔"},
    {id:102,name:"دوريتوز جبن",     nameEn:"Doritos cheese",     price:7, e:"🌽"},
    {id:103,name:"سنكرز",           nameEn:"Snickers",           price:5, e:"🍫"},
  ],
  drip:[
    {id:110,name:"Hot V60",           nameEn:"Hot V60",             price:22,e:"☕"},
    {id:111,name:"قهوة اليوم بارد",  nameEn:"Iced coffeday",       price:20,e:"🧊"},
    {id:112,name:"قهوة اليوم حار",   nameEn:"Hot coffeday",        price:18,e:"☕"},
    {id:113,name:"Iced V60",          nameEn:"Iced V60",            price:22,e:"🧊"},
    {id:114,name:"قهوة اليوم + كوكيز",nameEn:"Coffee day + Cookies",price:25,e:"☕"},
  ],
}

const DISCOUNTS=[
  {id:1,name:"Employees discount",    pct:20, color:"#3B82F6"},
  {id:2,name:"FA Staff discount",     pct:100,color:P},
  {id:3,name:"Marketing discount 100%",pct:100,color:"#EF4444",warn:true},
  {id:4,name:"Marketing discount 50%", pct:50, color:"#EF4444",warn:true},
]

const CUSTOMERS=[
  {id:1,name:"Bader",               phone:"0566470864"},
  {id:2,name:"Office",              phone:"0530989821"},
  {id:3,name:"Boss fares",          phone:"0560895589"},
  {id:4,name:"Redwan",              phone:"0598171818"},
  {id:5,name:"Salman",              phone:"0538036532"},
  {id:6,name:"C.Abdullah",          phone:"0531113616"},
  {id:7,name:"C.Yazed",             phone:"0500000000"},
  {id:8,name:"بطولة السوبر الرياضي",phone:"0500000001"},
]

const ORDER_TYPES=[
  {key:"محلي",  label:"محلي",  icon:"🪑", desc:"Dine In"},
  {key:"سفري",  label:"سفري",  icon:"🥡", desc:"Take Away"},
  {key:"توصيل", label:"توصيل", icon:"🛵", desc:"Delivery"},
]

// ── Supabase helpers ──────────────────────────────────────────────────────────
async function dbSaveOrder(order, userId) {
  const { data, error } = await supabase.from('orders').insert([{
    external_id:  order.id,
    num:          order.num,
    status:       order.status,
    amount:       order.amount,
    discount:     order.discount,
    tax:          order.tax,
    pay_method:   order.payMethod,
    order_type:   order.type,
    items:        order.items,
    customer:     order.customer || null,
    notes:        order.notes || null,
    cancel_reason:order.cancelReason || null,
    return_reason:order.returnReason || null,
    original_id:  order.originalId || null,
    cashier_id:   userId,
  }]).select()
  if (error) console.error('DB save error:', error)
  return data
}

async function dbUpdateOrderStatus(externalId, status, payMethod) {
  const { error } = await supabase
    .from('orders')
    .update({ status, pay_method: payMethod || undefined, updated_at: new Date().toISOString() })
    .eq('external_id', externalId)
  if (error) console.error('DB update error:', error)
}

function dbRowToOrder(row) {
  return {
    id:          row.external_id,
    num:         row.num,
    status:      row.status,
    amount:      row.amount,
    discount:    row.discount,
    tax:         row.tax,
    payMethod:   row.pay_method,
    type:        row.order_type,
    items:       row.items || [],
    customer:    row.customer,
    notes:       row.notes,
    cancelReason:row.cancel_reason,
    returnReason:row.return_reason,
    originalId:  row.original_id,
    time:        new Date(row.created_at).toLocaleTimeString('ar-SA',{hour:'2-digit',minute:'2-digit'}) + ' م',
  }
}

// ── Calendar ──────────────────────────────────────────────────────────────────
function Calendar({title,onClose,onSelect}){
  const [m,setM]=useState(3),[y,setY]=useState(2026),[sel,setSel]=useState(24)
  const mN=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"]
  const dN=["أحد","اثنين","ثلاثاء","أربعاء","خميس","جمعة","سبت"]
  const days=new Date(y,m+1,0).getDate(),first=new Date(y,m,1).getDay()
  const cells=[...Array(first).fill(null),...Array(days).fill(0).map((_,i)=>i+1)]
  return(<div style={ov} onClick={onClose}><div style={{...mod,padding:0,overflow:"hidden",maxWidth:380}} onClick={e=>e.stopPropagation()}>
    <div style={{padding:"14px 20px",display:"flex",justifyContent:"space-between",borderBottom:"1px solid #E5E7EB"}}>
      <button style={lnk("#3B82F6")} onClick={()=>onSelect&&onSelect(`${y}/${String(m+1).padStart(2,"0")}/${String(sel).padStart(2,"0")}`)}>عرض</button>
      <span style={{fontWeight:700}}>{title}</span>
      <button style={lnk()} onClick={onClose}>رجوع</button>
    </div>
    <div style={{padding:"10px 20px",color:"#3B82F6",fontWeight:700,fontSize:14,borderBottom:"1px solid #F3F4F6"}}>{y}/{String(m+1).padStart(2,"0")}/{String(sel).padStart(2,"0")}</div>
    <div style={{padding:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <button onClick={()=>m<11?setM(v=>v+1):(setM(0),setY(v=>v+1))} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:"#374151"}}>›</button>
        <span style={{fontWeight:700,fontSize:15}}>{mN[m]} {y}</span>
        <button onClick={()=>m>0?setM(v=>v-1):(setM(11),setY(v=>v-1))} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:"#374151"}}>‹</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,textAlign:"center"}}>
        {dN.map(d=><div key={d} style={{fontSize:10,color:"#9CA3AF",padding:"4px 0"}}>{d}</div>)}
        {cells.map((d,i)=><div key={i} onClick={()=>d&&setSel(d)} style={{padding:"8px 0",borderRadius:"50%",cursor:d?"pointer":"default",background:d===sel?"#3B82F6":"transparent",color:d===sel?"#fff":d?"#1F2937":"transparent",fontWeight:d===sel?700:400,fontSize:14}}>{d||""}</div>)}
      </div>
    </div>
  </div></div>)
}

// ── Main POS Component ────────────────────────────────────────────────────────
export default function POS({ session }) {
  const [screen,    setScreen]    = useState("main")
  const [activeCat, setActiveCat] = useState(null)
  const [cart,      setCart]      = useState([])
  const [counter,   setCounter]   = useState(1)
  const [discount,  setDiscount]  = useState(null)
  const [customer,  setCustomer]  = useState(null)
  const [payMethod, setPayMethod] = useState(null)
  const [cashPaid,  setCashPaid]  = useState(null)
  const [notes,     setNotes]     = useState("")
  const [notesInput,setNotesInput]= useState("")
  const [orderType, setOrderType] = useState("محلي")
  const [showTypeModal,setShowTypeModal]=useState(false)
  const [changeDialog,setChangeDialog]=useState(null)
  const [returnStep,  setReturnStep]  = useState(0)
  const [retQtys,     setRetQtys]     = useState({})
  const [retReason,   setRetReason]   = useState("")
  const [retMethod,   setRetMethod]   = useState("")
  const [orders,    setOrders]    = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [modal,     setModal]     = useState(null)
  const [discType,  setDiscType]  = useState("amount")
  const [discInput, setDiscInput] = useState("")
  const [search,    setSearch]    = useState("")
  const [ordTab,    setOrdTab]    = useState("الكل")
  const [ordSearch, setOrdSearch] = useState("")
  const [selOrderId,setSelOrderId]= useState(null)
  const [newCust,   setNewCust]   = useState({name:"",phone:"",email:""})
  const [settleModal,setSettleModal]=useState(false)
  const [settleMethod,setSettleMethod]=useState("")
  const [isMobile,  setIsMobile]  = useState(window.innerWidth < 768)
  const [showMobileCart,setShowMobileCart]=useState(false)
  const [calFor,    setCalFor]    = useState(null)
  const [reportDate,setReportDate]= useState("2026/04/24")
  const [toast,     setToast]     = useState(null)

  const userId = session?.user?.id

  // ── Load orders from Supabase on mount ────────────────────────────────────
  useEffect(() => {
    loadOrders()
    // Real-time subscription
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders()
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const loadOrders = async () => {
    setLoadingOrders(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
    if (!error && data) {
      setOrders(data.map(dbRowToOrder))
      // set counter to max num + 1
      if (data.length > 0) {
        const maxNum = Math.max(...data.map(r => r.num || 0))
        setCounter(maxNum + 1)
      }
    }
    setLoadingOrders(false)
  }

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  // ── Calculations ──────────────────────────────────────────────────────────
  const totalInc   = cart.reduce((s,i)=>s+i.price*i.qty,0)
  const discAmt    = !discount?0:discount.type==="amount"?Math.min(parseFloat(discount.value)||0,totalInc):(totalInc*(parseFloat(discount.value)||0))/100
  const afterDisc  = Math.max(0,totalInc-discAmt)
  const taxExtract = afterDisc*TAX_F
  const grandTotal = afterDisc
  const change     = cashPaid!==null?Math.max(0,cashPaid-grandTotal):0
  const activeCount= orders.filter(o=>o.status==="نشط").length
  const selOrder   = orders.find(o=>o.id===selOrderId)
  const filtOrders = orders.filter(o=>ordTab==="الكل"||o.status===ordTab).filter(o=>!ordSearch||String(o.id).includes(ordSearch)||String(o.num).includes(ordSearch))
  const filtProds  = activeCat?(PRODS[activeCat]||[]).filter(p=>!search||p.name.includes(search)||p.nameEn.toLowerCase().includes(search.toLowerCase())):Object.values(PRODS).flat().filter(p=>!search||p.name.includes(search)||p.nameEn.toLowerCase().includes(search.toLowerCase()))

  const pop=(msg)=>{setToast(msg);setTimeout(()=>setToast(null),2500)}

  // ── Add to cart ───────────────────────────────────────────────────────────
  const addToCart=(p)=>{
    if(cart.length===0){setShowTypeModal(true);setCart([{...p,qty:1}])}
    else{setCart(prev=>{const ex=prev.find(i=>i.id===p.id);return ex?prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...prev,{...p,qty:1}]})}
  }
  const updQty=(id,d)=>setCart(prev=>prev.map(i=>i.id===id?{...i,qty:Math.max(0,i.qty+d)}:i).filter(i=>i.qty>0))

  // ── Generate order ID ─────────────────────────────────────────────────────
  const genId = () => 118000 + Math.floor(Math.random()*9000)

  // ── Finish payment ────────────────────────────────────────────────────────
  const finishPayment = async () => {
    const wasCash   = payMethod==="Cash"
    const changeAmt = wasCash&&cashPaid!==null?Math.max(0,cashPaid-grandTotal):0
    const newOrder  = {
      id:counter+100000, num:counter, status:"تم", amount:grandTotal,
      time:nowStr(), type:orderType,
      items:cart.map(i=>({name:i.name,qty:i.qty,price:i.price})),
      discount:discAmt, tax:taxExtract,
      payMethod:wasCash?"كاش":payMethod==="بطاقة"?"بطاقة":"تحويل",
      customer:customer?.name||null, notes
    }
    setOrders(prev=>[newOrder,...prev])
    setCounter(n=>n+1)
    setCart([]);setDiscount(null);setCustomer(null);setPayMethod(null);setCashPaid(null);setNotes("");setOrderType("محلي");setScreen("main")
    await dbSaveOrder(newOrder, userId)
    if(wasCash&&changeAmt>0) setChangeDialog({amount:changeAmt})
    else pop("✅ تم إتمام الطلب بنجاح")
  }

  // ── Cancel order ──────────────────────────────────────────────────────────
  const cancelOrder = async (reason) => {
    if(cart.length>0){
      const cancelled={id:genId(),num:counter,status:"ملغى",amount:0,time:nowStr(),type:orderType,items:cart.map(i=>({name:i.name,qty:i.qty,price:i.price})),discount:0,tax:0,payMethod:"—",cancelReason:reason}
      setOrders(prev=>[cancelled,...prev])
      await dbSaveOrder(cancelled, userId)
    }
    setCart([]);setDiscount(null);setCustomer(null);setNotes("");setOrderType("محلي");setModal(null)
    pop(`❌ إلغاء: ${reason}`)
  }

  // ── Suspend (save as نشط) ─────────────────────────────────────────────────
  const suspendCart = async () => {
    if(cart.length>0){
      const suspended={id:genId(),num:counter,status:"نشط",amount:grandTotal,time:nowStr(),type:orderType,items:cart.map(i=>({name:i.name,qty:i.qty,price:i.price})),discount:discAmt,tax:taxExtract,payMethod:"—",customer:customer?.name||null,notes}
      setOrders(prev=>[suspended,...prev])
      setCounter(n=>n+1)
      await dbSaveOrder(suspended, userId)
      pop("⏸️ تم حفظ الطلب كنشط")
    }
    setCart([]);setDiscount(null);setCustomer(null);setNotes("");setActiveCat(null);setSearch("");setCashPaid(null);setPayMethod(null);setOrderType("محلي");setScreen("main")
  }

  // ── Return ────────────────────────────────────────────────────────────────
  const retTotal=()=>{if(!selOrder)return 0;return(selOrder.items||[]).reduce((s,item,i)=>s+(item.price*(retQtys[i]||0)),0)}
  const confirmReturn = async () => {
    if(!selOrder)return
    const returnItems=(selOrder.items||[]).map((it,i)=>({name:it.name,qty:retQtys[i]||0,price:it.price})).filter(it=>it.qty>0)
    const amt=returnItems.reduce((s,it)=>s+it.price*it.qty,0)
    const newRet={id:genId(),num:counter,status:"مرتجع",amount:amt,time:nowStr(),type:selOrder.type,items:returnItems,discount:0,tax:amt*TAX_F,payMethod:retMethod,returnReason:retReason,originalId:selOrder.id}
    setOrders(prev=>[newRet,...prev])
    setCounter(n=>n+1)
    await dbSaveOrder(newRet, userId)
    setReturnStep(3)
  }

  // ── Settle active order ───────────────────────────────────────────────────
  const settleActiveOrder = async (method) => {
    if(!selOrder)return
    setOrders(prev=>prev.map(o=>o.id===selOrder.id?{...o,status:"تم",payMethod:method,time:nowStr()}:o))
    await dbUpdateOrderStatus(selOrder.id, "تم", method)
    setSettleModal(false);setSettleMethod("");setModal(null)
    pop("✅ تم تعميد الطلب بنجاح")
  }

  const checkActiveOrders=(action)=>{if(activeCount>0){pop(`⚠️ يوجد ${activeCount} طلب نشط — أغلق جميع الطلبات النشطة أولاً`);return false}action();return true}

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SUB COMPONENTS
  // ════════════════════════════════════════════════════════════════════════════

  const CartPanel=()=>(
    <div style={{width:isMobile?"100%":300,borderLeft:"1px solid #E5E7EB",background:"#fff",display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"12px 16px",borderBottom:"1px solid #E5E7EB",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:11,color:"#9CA3AF"}}>{orderType}</span>
        <span style={{fontWeight:700,fontSize:14}}>🛒 الطلب الحالي</span>
      </div>
      <div style={{flex:1,overflow:"auto"}}>
        {cart.length===0?(
          <div style={{textAlign:"center",padding:32,color:"#9CA3AF"}}>
            <div style={{fontSize:36,marginBottom:8}}>🛒</div>
            <div style={{fontSize:13}}>السلة فارغة</div>
          </div>
        ):cart.map(item=>(
          <div key={item.id} style={{padding:"10px 16px",borderBottom:"1px solid #F9FAFB"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13}}>{item.e} {item.name}</div>
                <div style={{fontSize:11,color:"#9CA3AF"}}>{fmt(item.price)} × {item.qty}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
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
        {discAmt>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span style={{color:"#10B981",fontWeight:700}}>- {fmt(discAmt)}</span><span style={{color:"#6B7280"}}>{discount?.name||"خصم"}</span></div>}
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:8,color:"#9CA3AF"}}><span>{fmt(taxExtract)}</span><span>ضريبة 15% — مشمولة</span></div>
        {screen==="main"?(
          <button disabled={!cart.length} onClick={()=>setScreen("payment")} style={{background:cart.length?grad:"#E5E7EB",color:"#fff",border:"none",borderRadius:12,padding:"14px",width:"100%",fontSize:16,fontWeight:900,cursor:cart.length?"pointer":"not-allowed",display:"flex",justifyContent:"space-between",boxShadow:cart.length?"0 4px 14px rgba(124,58,237,.4)":"none",transition:"all .2s",marginTop:4}}>
            <span>{fmt(grandTotal)}</span><span>الإجمالي</span>
          </button>
        ):(
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:"1px solid #E5E7EB",marginTop:4}}>
            <span style={{fontWeight:900,fontSize:17,color:P}}>{fmt(grandTotal)}</span>
            <span style={{fontWeight:700,fontSize:17}}>الإجمالي</span>
          </div>
        )}
      </div>
    </div>
  )

  const TB=({icon,label,onClick})=>(<button onClick={onClick} style={{background:P,color:"#fff",border:"none",borderRadius:10,padding:"7px 11px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:54,fontSize:11,fontWeight:600,boxShadow:"0 2px 8px rgba(124,58,237,.25)"}}><span style={{fontSize:16}}>{icon}</span><span>{label}</span></button>)

  const MainToolbar=()=>(
    <div style={{background:"#fff",padding:"8px 12px",display:"flex",gap:6,borderBottom:"1px solid #E5E7EB",flexWrap:"wrap",alignItems:"center"}}>
      <TB icon="🖨️" label="طباعة"   onClick={()=>pop("تم الإرسال للطباعة")}/>
      <TB icon="👨‍🍳" label="مطبخ"    onClick={()=>pop("تم الإرسال للمطبخ")}/>
      <TB icon="🚫" label="إلغاء"   onClick={()=>cart.length?setModal("cancel"):pop("لا يوجد طلب نشط")}/>
      <TB icon="🏷️" label="خصم"     onClick={()=>cart.length?setModal("discountChoice"):pop("أضف منتجاً أولاً")}/>
      <TB icon="📝" label="ملاحظات" onClick={()=>setModal("notes")}/>
      <div style={{marginRight:"auto",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:11,color:"#9CA3AF"}}>{session?.user?.email}</span>
        <button onClick={handleLogout} style={{background:"#EF4444",color:"#fff",border:"none",borderRadius:10,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:700}}>خروج</button>
      </div>
    </div>
  )

  const BackBar=({title,onBack,extra})=>(
    <div style={{background:"#fff",padding:"10px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid #E5E7EB"}}>
      <button style={{background:PL,color:P,border:"none",borderRadius:10,padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:13}} onClick={onBack}>← رجوع</button>
      {title&&<span style={{fontWeight:700,fontSize:15,flex:1,textAlign:"center"}}>{title}</span>}
      {extra}
    </div>
  )

  const BottomNav=()=>(
    <div style={{background:"#fff",borderTop:"1px solid #E5E7EB",display:"flex",justifyContent:"space-around",padding:"8px 0"}}>
      {[{icon:"🏠",label:"الرئيسية",sc:"main"},{icon:"🕐",label:"الطلبات",sc:"orders"},{icon:"➕",label:"جديد",sc:"new"}].map(({icon,label,sc})=>(
        <button key={label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 20px",cursor:"pointer",background:"none",border:"none",color:screen===sc?P:"#9CA3AF",fontSize:12,fontWeight:screen===sc?700:400}}
          onClick={()=>{if(sc==="new"){suspendCart()}else if(sc)setScreen(sc)}}>
          <span style={{fontSize:20}}>{icon}</span><span>{label}</span>
        </button>
      ))}
    </div>
  )

  // ── Main Screen ───────────────────────────────────────────────────────────
  const MainScreen=()=>(
    <>
      <MainToolbar/>
      <div style={{flex:1,overflow:"auto",padding:16}}>
        <div style={{position:"relative",marginBottom:14}}>
          <span style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",color:P,fontSize:16}}>🔍</span>
          <input style={{width:"100%",padding:"10px 42px 10px 14px",border:`1.5px solid ${search?P:"#E5E7EB"}`,borderRadius:12,fontSize:14,direction:"rtl",boxSizing:"border-box",background:"#fff",outline:"none"}} placeholder="بحث في المنتجات" value={search} onChange={e=>{setSearch(e.target.value);if(e.target.value)setActiveCat(null)}}/>
          {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#9CA3AF",cursor:"pointer",fontSize:16}}>✕</button>}
        </div>
        {!activeCat&&!search&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
            {CATS.map(cat=>(
              <div key={cat.id} onClick={()=>setActiveCat(cat.id)} style={{background:"#fff",border:"1.5px solid #E5E7EB",borderBottom:`4px solid ${P}`,borderRadius:14,padding:"18px 10px 14px",cursor:"pointer",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
                <div style={{fontSize:26,marginBottom:8}}>{cat.icon}</div>
                <div style={{fontWeight:700,fontSize:12,color:"#374151"}}>{cat.name}</div>
                <div style={{fontSize:10,color:"#9CA3AF",marginTop:2}}>{cat.nameAr}</div>
                <div style={{fontSize:10,color:P,marginTop:3,fontWeight:600}}>{(PRODS[cat.id]||[]).length} منتج</div>
              </div>
            ))}
          </div>
        )}
        {(activeCat||search)&&(
          <div>
            {activeCat&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <button onClick={()=>setActiveCat(null)} style={{background:PL,color:P,border:"none",borderRadius:10,padding:"6px 14px",cursor:"pointer",fontWeight:700,fontSize:13}}>← رجوع</button>
              <span style={{fontWeight:700,color:"#374151",fontSize:15}}>{CATS.find(c=>c.id===activeCat)?.name}</span>
            </div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
              {filtProds.map(p=>{const inCart=cart.find(i=>i.id===p.id);return(
                <div key={p.id} onClick={()=>addToCart(p)} style={{background:inCart?PL:"#fff",border:`1.5px solid ${inCart?P:"#E5E7EB"}`,borderRadius:14,padding:"14px 10px",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"all .15s"}}>
                  <div style={{fontSize:24}}>{p.e}</div>
                  <div style={{fontWeight:700,fontSize:12,color:"#1F2937"}}>{p.name}</div>
                  <div style={{fontSize:10,color:"#9CA3AF"}}>{p.nameEn}</div>
                  <div style={{fontWeight:900,color:P,fontSize:13}}>{fmt(p.price)}</div>
                  <div style={{fontSize:9,color:"#C4B5FD"}}>شامل الضريبة</div>
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

  // ── Payment Screen ────────────────────────────────────────────────────────
  const PaymentScreen=()=>(
    <>
      <BackBar onBack={()=>setScreen("main")} extra={<div style={{marginRight:"auto",display:"flex",gap:8}}>
        <button style={{background:"#6B7280",color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:13}} onClick={()=>setModal("customerList")}>العميل</button>
      </div>}/>
      <div style={{flex:1,overflow:"auto",padding:24,maxWidth:480,margin:"0 auto",width:"100%"}}>
        <h3 style={{textAlign:"center",marginBottom:20,fontWeight:700,fontSize:17}}>طرق الدفع</h3>
        {["Cash","بطاقة","تحويل مباشر"].map(m=>(
          <button key={m} onClick={()=>{setPayMethod(m);if(m==="Cash")setModal("cashAmounts");else setCashPaid(null)}} style={{background:"#fff",border:`2px solid ${payMethod===m?P:"#E5E7EB"}`,borderRight:`6px solid ${P}`,borderRadius:12,padding:"16px 20px",cursor:"pointer",width:"100%",textAlign:"right",fontSize:15,fontWeight:600,marginBottom:10,color:"#1F2937",boxShadow:payMethod===m?"0 0 0 3px "+PL:"none",transition:"all .15s"}}>
            {m==="Cash"?"💵 ":m==="بطاقة"?"💳 ":"🔄 "}{m}
          </button>
        ))}
        <div style={{background:PL,borderRadius:14,padding:"14px 18px",marginTop:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontWeight:900,fontSize:18,color:P}}>{fmt(grandTotal)}</span><span style={{fontWeight:600,color:PD}}>المتبقي للدفع</span></div>
          {discAmt>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:PD,borderTop:`1px solid ${PL}`,paddingTop:6}}><span>- {fmt(discAmt)}</span><span>الخصم المطبق</span></div>}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#8B5CF6",marginTop:4}}><span>{fmt(taxExtract)}</span><span>ضريبة 15% — مشمولة</span></div>
        </div>
        {payMethod==="Cash"&&cashPaid!==null&&(
          <div style={{background:"#F0FDF4",borderRadius:14,padding:"12px 18px",marginTop:10,display:"flex",justifyContent:"space-between",alignItems:"center",border:"1.5px solid #BBF7D0"}}>
            <div><div style={{fontWeight:900,fontSize:20,color:"#065F46"}}>{fmt(change)}</div><div style={{fontSize:11,color:"#065F46",marginTop:2}}>سيُعطى للعميل بعد إتمام الطلب</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"#6B7280"}}>دفع</div><div style={{fontWeight:700,fontSize:15}}>{fmt(cashPaid)}</div></div>
          </div>
        )}
        <button disabled={!payMethod} onClick={finishPayment} style={{background:payMethod?grad:"#E5E7EB",color:"#fff",border:"none",borderRadius:12,padding:"16px",width:"100%",fontSize:16,fontWeight:900,cursor:payMethod?"pointer":"not-allowed",marginTop:16,boxShadow:payMethod?"0 4px 14px rgba(124,58,237,.4)":"none"}}>دفع</button>
      </div>
    </>
  )

  // ── Orders Screen ─────────────────────────────────────────────────────────
  const OrdersScreen=()=>{
    const statusColors={نشط:{bg:"#D1FAE5",c:"#065F46"},تم:{bg:"#EDE9FE",c:"#5B21B6"},ملغى:{bg:"#FEE2E2",c:"#991B1B"},معلق:{bg:"#FEF3C7",c:"#92400E"},مرتجع:{bg:"#FFF7ED",c:"#C2410C"}}
    return(
      <>
        <div style={{background:"#fff",padding:"8px 12px",display:"flex",gap:8,borderBottom:"1px solid #E5E7EB",alignItems:"center"}}>
          <button style={{background:"#6B7280",color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:13}} onClick={()=>setScreen("main")}>← رجوع</button>
          <div style={{marginRight:"auto",display:"flex",gap:8}}>
            <button style={{background:selOrderId?P:"#9CA3AF",color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:13}} onClick={()=>{if(!selOrderId){pop("اختر طلباً أولاً");return}setModal("orderOptions")}}>المزيد</button>
            <button style={{background:P,color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:13}} onClick={()=>{loadOrders();pop("🔄 تم المزامنة")}}>مزامنة</button>
          </div>
        </div>
        <div style={{background:"#fff",padding:"8px 12px",borderBottom:"1px solid #E5E7EB"}}>
          <input style={{width:"100%",padding:"9px 14px",border:"1.5px solid #E5E7EB",borderRadius:10,fontSize:14,direction:"rtl",boxSizing:"border-box",marginBottom:8}} placeholder="بحث في الطلبات" value={ordSearch} onChange={e=>setOrdSearch(e.target.value)}/>
          <div style={{display:"flex"}}>
            {[{label:"الكل",filter:"الكل"},{label:"النشطة",filter:"نشط"},{label:"المعتمدة",filter:"تم"},{label:"الملغاة",filter:"ملغى"},{label:"المرتجعة",filter:"مرتجع"}].map(({label,filter})=>(
              <button key={filter} onClick={()=>setOrdTab(filter)} style={{flex:1,padding:"8px 4px",background:"none",border:"none",borderBottom:`3px solid ${ordTab===filter?P:"transparent"}`,color:ordTab===filter?P:"#6B7280",fontWeight:ordTab===filter?700:400,cursor:"pointer",fontSize:12}}>
                {label}{filter==="الكل"?` (${orders.length})`:filter==="نشط"&&activeCount>0?` (${activeCount})`:""}
              </button>
            ))}
          </div>
        </div>
        {loadingOrders?(
          <div style={{textAlign:"center",padding:32,color:"#9CA3AF"}}>جاري تحميل الطلبات...</div>
        ):(
          <div style={{flex:1,overflow:"auto"}}>
            {filtOrders.map(o=>{
              const sc=statusColors[o.status]||{bg:"#F3F4F6",c:"#374151"}
              const isSelected=o.id===selOrderId
              return(
                <div key={o.id} style={{padding:"14px 16px",borderBottom:"1px solid #F3F4F6",cursor:"pointer",background:isSelected?PL:"transparent",display:"flex",justifyContent:"space-between",borderRight:isSelected?`4px solid ${P}`:"4px solid transparent"}}
                  onClick={()=>setSelOrderId(isSelected?null:o.id)}>
                  <div>
                    <div style={{fontWeight:700,fontSize:14}}>#{o.num}</div>
                    <div style={{color:"#6B7280",fontSize:12,marginTop:2}}>{o.type}</div>
                    <div style={{color:"#9CA3AF",fontSize:11}}>{o.time}</div>
                  </div>
                  <div style={{textAlign:"left"}}>
                    <span style={{display:"inline-block",padding:"3px 12px",borderRadius:20,fontSize:12,fontWeight:700,background:sc.bg,color:sc.c}}>{o.status}</span>
                    <div style={{fontWeight:700,marginTop:4,color:P}}>{fmt(o.amount)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </>
    )
  }

  // ── Report Screen ─────────────────────────────────────────────────────────
  const ReportScreen=()=>{
    if(activeCount>0) return(
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
        <div style={{fontWeight:700,fontSize:18,color:"#92400E",marginBottom:8}}>لا يمكن إصدار التقرير</div>
        <div style={{color:"#6B7280",marginBottom:24}}>يوجد <strong style={{color:P}}>{activeCount}</strong> طلب نشط — أغلق جميع الطلبات النشطة أولاً</div>
        <button style={{background:grad,color:"#fff",border:"none",borderRadius:12,padding:"12px 28px",cursor:"pointer",fontWeight:700,fontSize:15}} onClick={()=>{setScreen("orders");setOrdTab("نشط")}}>عرض الطلبات النشطة</button>
        <button style={{marginTop:12,background:"none",border:"none",color:"#6B7280",cursor:"pointer",fontWeight:600}} onClick={()=>setScreen("main")}>رجوع</button>
      </div>
    )
    const doneOrders=orders.filter(o=>o.status==="تم")
    const totalRev=doneOrders.reduce((s,o)=>s+o.amount,0)
    const totalTax=doneOrders.reduce((s,o)=>s+o.tax,0)
    const totalDisc=doneOrders.reduce((s,o)=>s+o.discount,0)
    return(
      <>
        <BackBar title="تقرير اليوم" onBack={()=>setScreen("main")}/>
        <div style={{flex:1,overflow:"auto",padding:20}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
            {[
              {label:"إجمالي المبيعات",val:fmt(totalRev),color:"#10B981"},
              {label:"عدد الطلبات",val:doneOrders.length,color:P},
              {label:"ضريبة القيمة المضافة",val:fmt(totalTax),color:"#F59E0B"},
              {label:"إجمالي الخصومات",val:fmt(totalDisc),color:"#EF4444"},
            ].map(({label,val,color})=>(
              <div key={label} style={{background:"#fff",borderRadius:14,padding:"16px",boxShadow:"0 2px 8px rgba(0,0,0,.05)",borderTop:`4px solid ${color}`}}>
                <div style={{fontWeight:900,fontSize:20,color}}>{val}</div>
                <div style={{fontSize:12,color:"#6B7280",marginTop:4}}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#fff",borderRadius:14,padding:16,boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
            <div style={{fontWeight:700,marginBottom:12}}>طرق الدفع</div>
            {["كاش","بطاقة","تحويل"].map(m=>{
              const mOrders=doneOrders.filter(o=>o.payMethod===m)
              return mOrders.length>0?(
                <div key={m} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F3F4F6",fontSize:14}}>
                  <span style={{fontWeight:700,color:P}}>{fmt(mOrders.reduce((s,o)=>s+o.amount,0))}</span>
                  <span style={{color:"#374151"}}>{m} ({mOrders.length} طلب)</span>
                </div>
              ):null
            })}
          </div>
        </div>
      </>
    )
  }

  // ── Modals ────────────────────────────────────────────────────────────────
  const OrderTypeModal=()=>(
    <div style={ov} onClick={()=>setShowTypeModal(false)}>
      <div style={{...mod,maxWidth:360}} onClick={e=>e.stopPropagation()}>
        <div style={{fontWeight:700,fontSize:16,marginBottom:20,textAlign:"center"}}>نوع الطلب</div>
        {ORDER_TYPES.map(t=>(
          <button key={t.key} onClick={()=>{setOrderType(t.key);setShowTypeModal(false)}} style={{background:"#fff",border:`2px solid ${orderType===t.key?P:"#E5E7EB"}`,borderRadius:12,padding:"14px 18px",cursor:"pointer",width:"100%",textAlign:"right",fontSize:15,fontWeight:600,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:orderType===t.key?"0 0 0 3px "+PL:"none"}}>
            <span style={{color:"#9CA3AF",fontSize:13}}>{t.desc}</span>
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
          <span style={{fontWeight:700,fontSize:16}}>نوع الخصم</span>
        </div>
        {DISCOUNTS.map(d=>(
          <button key={d.id} onClick={()=>{setDiscount({name:d.name,type:"pct",value:d.pct});setModal(null);pop(`✅ خصم ${d.pct}% — ${d.name}`)}} style={{background:"#fff",border:`2px solid ${d.color}20`,borderRight:`6px solid ${d.color}`,borderRadius:12,padding:"14px 18px",cursor:"pointer",width:"100%",textAlign:"right",fontSize:14,fontWeight:600,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:d.color,fontWeight:900}}>{d.pct}%</span>
            <span>{d.name}</span>
          </button>
        ))}
        <button onClick={()=>setModal("discountInput")} style={{background:PL,border:`2px solid ${P}`,borderRadius:12,padding:"14px 18px",cursor:"pointer",width:"100%",textAlign:"center",fontSize:14,fontWeight:700,color:P,marginTop:4}}>خصم مخصص ✏️</button>
        {discount&&<button onClick={()=>{setDiscount(null);setModal(null);pop("❌ تم إلغاء الخصم")}} style={{background:"#FEE2E2",border:"none",borderRadius:12,padding:"12px",cursor:"pointer",width:"100%",fontSize:13,fontWeight:700,color:"#991B1B",marginTop:8}}>إلغاء الخصم الحالي</button>}
      </div>
    </div>
  )

  const DiscountInputModal=()=>(
    <div style={ov} onClick={()=>setModal(null)}>
      <div style={{...mod}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <button style={lnk()} onClick={()=>setModal(null)}>✕</button>
          <span style={{fontWeight:700,fontSize:16}}>خصم مخصص</span>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {["amount","pct"].map(t=>(
            <button key={t} onClick={()=>setDiscType(t)} style={{flex:1,padding:"10px",border:`2px solid ${discType===t?P:"#E5E7EB"}`,borderRadius:10,background:discType===t?PL:"#fff",color:discType===t?P:"#374151",fontWeight:700,cursor:"pointer",fontSize:14}}>{t==="amount"?"مبلغ ﷼":"نسبة %"}</button>
          ))}
        </div>
        <input type="number" value={discInput} onChange={e=>setDiscInput(e.target.value)} placeholder={discType==="amount"?"مثال: 10":"مثال: 15"} style={{width:"100%",padding:"12px",border:`1.5px solid ${P}`,borderRadius:10,fontSize:16,textAlign:"center",marginBottom:16,outline:"none"}}/>
        <button onClick={()=>{if(!discInput)return;setDiscount({name:`خصم ${discInput}${discType==="pct"?"%":"﷼"}`,type:discType,value:discInput});setDiscInput("");setModal(null);pop("✅ تم تطبيق الخصم")}} style={{background:grad,color:"#fff",border:"none",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:"pointer"}}>تطبيق</button>
      </div>
    </div>
  )

  const CancelModal=()=>{
    const reasons=["طلب خاطئ","المنتج غير متاح","تغيير رأي العميل","أخرى"]
    const [sel,setSel]=useState("")
    return(
      <div style={ov} onClick={()=>setModal(null)}>
        <div style={{...mod}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <button style={lnk()} onClick={()=>setModal(null)}>✕</button>
            <span style={{fontWeight:700,fontSize:16}}>سبب الإلغاء</span>
          </div>
          {reasons.map(r=>(
            <button key={r} onClick={()=>setSel(r)} style={{background:sel===r?PL:"#fff",border:`2px solid ${sel===r?P:"#E5E7EB"}`,borderRadius:12,padding:"12px 16px",cursor:"pointer",width:"100%",textAlign:"right",fontSize:14,fontWeight:600,marginBottom:8}}>{r}</button>
          ))}
          <button disabled={!sel} onClick={()=>cancelOrder(sel)} style={{background:sel?"#EF4444":"#E5E7EB",color:"#fff",border:"none",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:sel?"pointer":"not-allowed",marginTop:8}}>إلغاء الطلب</button>
        </div>
      </div>
    )
  }

  const CustomerListModal=()=>(
    <div style={ov} onClick={()=>setModal(null)}>
      <div style={{...mod}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <button style={lnk()} onClick={()=>setModal(null)}>✕</button>
          <span style={{fontWeight:700,fontSize:16}}>اختر العميل</span>
        </div>
        {CUSTOMERS.map(c=>(
          <div key={c.id} onClick={()=>{setCustomer(c);setModal(null);pop(`✅ ${c.name}`)}} style={{padding:"12px 16px",borderBottom:"1px solid #F3F4F6",cursor:"pointer",display:"flex",justifyContent:"space-between",background:customer?.id===c.id?PL:"transparent",borderRadius:8}}>
            <span style={{color:"#9CA3AF",fontSize:12}}>{c.phone}</span>
            <span style={{fontWeight:600}}>{c.name}</span>
          </div>
        ))}
        {customer&&<button onClick={()=>{setCustomer(null);setModal(null)}} style={{background:"#FEE2E2",border:"none",borderRadius:10,padding:"10px",width:"100%",color:"#991B1B",fontWeight:700,marginTop:8,cursor:"pointer"}}>إزالة العميل</button>}
      </div>
    </div>
  )

  const NotesModal=()=>(
    <div style={ov} onClick={()=>setModal(null)}>
      <div style={{...mod}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <button style={lnk()} onClick={()=>setModal(null)}>✕</button>
          <span style={{fontWeight:700,fontSize:16}}>ملاحظات الطلب</span>
        </div>
        <textarea value={notesInput} onChange={e=>setNotesInput(e.target.value)} placeholder="اكتب ملاحظاتك هنا..." style={{width:"100%",padding:"12px",border:`1.5px solid #E5E7EB`,borderRadius:10,fontSize:14,minHeight:120,resize:"vertical",outline:"none",direction:"rtl"}}/>
        <button onClick={()=>{setNotes(notesInput);setModal(null);pop("✅ تم حفظ الملاحظات")}} style={{background:grad,color:"#fff",border:"none",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:12}}>حفظ</button>
      </div>
    </div>
  )

  const CashAmountsModal=()=>{
    const amounts=[10,20,50,100,200,500]
    const [custom,setCustom]=useState("")
    return(
      <div style={ov} onClick={()=>setModal(null)}>
        <div style={{...mod}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <button style={lnk()} onClick={()=>setModal(null)}>✕</button>
            <span style={{fontWeight:700,fontSize:16}}>المبلغ المدفوع</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
            {amounts.map(a=>(
              <button key={a} onClick={()=>{setCashPaid(a);setModal(null)}} style={{background:cashPaid===a?grad:"#fff",color:cashPaid===a?"#fff":"#1F2937",border:`2px solid ${cashPaid===a?P:"#E5E7EB"}`,borderRadius:10,padding:"12px 8px",cursor:"pointer",fontWeight:700,fontSize:15}}>﷼{a}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{if(custom)setCashPaid(parseFloat(custom));setModal(null)}} style={{background:grad,color:"#fff",border:"none",borderRadius:10,padding:"12px 16px",cursor:"pointer",fontWeight:700,whiteSpace:"nowrap",fontSize:14}}>تأكيد</button>
            <input type="number" value={custom} onChange={e=>setCustom(e.target.value)} placeholder="مبلغ آخر" style={{flex:1,padding:"12px",border:"1.5px solid #E5E7EB",borderRadius:10,fontSize:14,textAlign:"center",outline:"none"}}/>
          </div>
        </div>
      </div>
    )
  }

  const OrderOptionsModal=()=>{
    if(!selOrder)return null
    return(
      <div style={ov} onClick={()=>setModal(null)}>
        <div style={{...mod}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <button style={lnk()} onClick={()=>setModal(null)}>✕</button>
            <span style={{fontWeight:700,fontSize:16}}>طلب #{selOrder.num}</span>
          </div>
          {selOrder.status==="نشط"&&(
            <button onClick={()=>{setSettleModal(true);setModal(null)}} style={{background:grad,color:"#fff",border:"none",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:10}}>💳 تعميد الطلب</button>
          )}
          {selOrder.status==="تم"&&(
            <button onClick={()=>{setReturnStep(1);setRetQtys({});setRetReason("");setRetMethod("");setModal(null)}} style={{background:"#FFF7ED",color:"#C2410C",border:"2px solid #FED7AA",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:"pointer"}}>↩ إرجاع</button>
          )}
        </div>
      </div>
    )
  }

  const ReturnStep1=()=>{
    if(!selOrder)return null
    return(
      <div style={ov}>
        <div style={{...mod}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <button style={lnk()} onClick={()=>setReturnStep(0)}>✕</button>
            <span style={{fontWeight:700,fontSize:16}}>اختر المنتجات للإرجاع</span>
          </div>
          {(selOrder.items||[]).map((item,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #F3F4F6"}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <button onClick={()=>setRetQtys(q=>({...q,[i]:Math.min((q[i]||0)+1,item.qty)}))} style={{background:P,color:"#fff",border:"none",borderRadius:6,width:24,height:24,cursor:"pointer",fontSize:14}}>+</button>
                <span style={{fontWeight:700,minWidth:24,textAlign:"center"}}>{retQtys[i]||0}</span>
                <button onClick={()=>setRetQtys(q=>({...q,[i]:Math.max((q[i]||0)-1,0)}))} style={{background:"#6B7280",color:"#fff",border:"none",borderRadius:6,width:24,height:24,cursor:"pointer",fontSize:14}}>−</button>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontWeight:600,fontSize:14}}>{item.name}</div>
                <div style={{fontSize:11,color:"#9CA3AF"}}>الكمية: {item.qty} — {fmt(item.price)}</div>
              </div>
            </div>
          ))}
          <div style={{marginTop:16,padding:"12px",background:PL,borderRadius:10,textAlign:"center",fontWeight:700,color:P,fontSize:16}}>{fmt(retTotal())}</div>
          <button disabled={retTotal()===0} onClick={()=>setReturnStep(2)} style={{background:retTotal()>0?grad:"#E5E7EB",color:"#fff",border:"none",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:retTotal()>0?"pointer":"not-allowed",marginTop:12}}>التالي</button>
        </div>
      </div>
    )
  }

  const ReturnStep2=()=>{
    const reasons=["طلب خاطئ","المنتج غير متاح"]
    const methods=["كاش 💵","بطاقة 💳"]
    return(
      <div style={ov}>
        <div style={{...mod}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <button style={lnk()} onClick={()=>setReturnStep(1)}>← رجوع</button>
            <span style={{fontWeight:700,fontSize:16}}>سبب وطريقة الاسترداد</span>
          </div>
          <div style={{fontWeight:700,marginBottom:8,fontSize:13}}>السبب</div>
          {reasons.map(r=>(
            <button key={r} onClick={()=>setRetReason(r)} style={{background:retReason===r?PL:"#fff",border:`2px solid ${retReason===r?P:"#E5E7EB"}`,borderRadius:10,padding:"12px",width:"100%",textAlign:"right",cursor:"pointer",fontWeight:600,marginBottom:8,fontSize:14}}>{r}</button>
          ))}
          <div style={{fontWeight:700,margin:"16px 0 8px",fontSize:13}}>طريقة الاسترداد</div>
          {methods.map(m=>(
            <button key={m} onClick={()=>setRetMethod(m)} style={{background:retMethod===m?PL:"#fff",border:`2px solid ${retMethod===m?P:"#E5E7EB"}`,borderRadius:10,padding:"12px",width:"100%",textAlign:"right",cursor:"pointer",fontWeight:600,marginBottom:8,fontSize:14}}>{m}</button>
          ))}
          <button disabled={!retReason||!retMethod} onClick={confirmReturn} style={{background:retReason&&retMethod?grad:"#E5E7EB",color:"#fff",border:"none",borderRadius:12,padding:"14px",width:"100%",fontSize:15,fontWeight:700,cursor:retReason&&retMethod?"pointer":"not-allowed",marginTop:8}}>تأكيد الإرجاع</button>
        </div>
      </div>
    )
  }

  const ReturnStep3=()=>(
    <div style={ov}>
      <div style={{...mod,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>✅</div>
        <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>تم الإرجاع بنجاح</div>
        <div style={{color:"#6B7280",marginBottom:24}}>{fmt(retTotal())} — {retMethod}</div>
        <button onClick={()=>{setReturnStep(0);setSelOrderId(null)}} style={{background:grad,color:"#fff",border:"none",borderRadius:12,padding:"14px 32px",cursor:"pointer",fontWeight:700,fontSize:15}}>موافق</button>
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
            <span style={{fontWeight:700,fontSize:16}}>تعميد الطلب</span>
          </div>
          <div style={{fontWeight:700,marginBottom:12,fontSize:14,color:"#374151"}}>اختر طريقة الدفع</div>
          {[{key:"كاش",icon:"💵"},{key:"بطاقة",icon:"💳"},{key:"تحويل",icon:"🔄"}].map(m=>(
            <button key={m.key} onClick={()=>setSettleMethod(m.key)} style={{background:"#fff",border:`2px solid ${settleMethod===m.key?P:"#E5E7EB"}`,borderRight:`6px solid ${P}`,borderRadius:12,padding:"14px 18px",cursor:"pointer",width:"100%",textAlign:"right",fontSize:15,fontWeight:600,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:settleMethod===m.key?"0 0 0 3px "+PL:"none"}}>
              <span style={{color:"#9CA3AF",fontSize:13}}>{m.key}</span>
              <span>{m.icon} {m.key}</span>
            </button>
          ))}
          <button disabled={!settleMethod} onClick={()=>settleActiveOrder(settleMethod)} style={{background:settleMethod?grad:"#E5E7EB",color:"#fff",border:"none",borderRadius:12,padding:"15px",width:"100%",fontSize:16,fontWeight:900,cursor:settleMethod?"pointer":"not-allowed",marginTop:8}}>تعميد الطلب ✓</button>
        </div>
      </div>
    )
  }

  const ChangeDialog=()=>{
    if(!changeDialog)return null
    return(
      <div style={{...ov,background:"rgba(0,0,0,.35)"}}>
        <div style={{background:"#fff",borderRadius:20,padding:"32px 40px",textAlign:"center",minWidth:300,maxWidth:360,boxShadow:"0 8px 40px rgba(0,0,0,.2)"}}>
          <div style={{fontWeight:700,fontSize:18,color:"#1F2937",marginBottom:20}}>المبلغ الباقي للعميل</div>
          <div style={{fontWeight:900,fontSize:36,color:"#1F2937",marginBottom:32}}>{fmt(changeDialog.amount)}</div>
          <button onClick={()=>{setChangeDialog(null);pop("✅ تم إتمام الطلب بنجاح")}} style={{background:"none",border:"none",color:P,fontWeight:700,fontSize:18,cursor:"pointer",width:"100%",padding:"10px"}}>موافق</button>
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
        <div style={{background:"#fff",borderRadius:"20px 20px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column",animation:"cartSlide .3s ease"}}>
          <div style={{padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #E5E7EB"}}>
            <button onClick={()=>{setShowMobileCart(false);setScreen("payment")}} disabled={!cart.length} style={{background:cart.length?grad:"#E5E7EB",color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",cursor:cart.length?"pointer":"not-allowed",fontWeight:700,fontSize:14}}>{fmt(grandTotal)} — دفع</button>
            <span style={{fontWeight:700,fontSize:16}}>🛒 السلة</span>
            <button onClick={()=>setShowMobileCart(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#374151"}}>✕</button>
          </div>
          <div style={{overflow:"auto",flex:1,padding:"0 0 16px"}}><CartPanel/></div>
        </div>
      </div>
    )
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
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
      {modal==="cashAmounts"   &&<CashAmountsModal/>}
      {modal==="orderOptions"  &&<OrderOptionsModal/>}
      {calFor&&<Calendar title="التقرير" onClose={()=>setCalFor(null)} onSelect={d=>{setReportDate(d);setCalFor(null);pop(`📅 ${d}`)}}/>}
      <ChangeDialog/>
      <SettleModal/>
      <MobileCartBtn/>
      <MobileCartOverlay/>
      {toast&&<div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"#1F2937",color:"#fff",padding:"11px 22px",borderRadius:30,fontWeight:600,fontSize:13,zIndex:400,boxShadow:"0 6px 24px rgba(0,0,0,.3)",animation:"slideUp .2s ease",whiteSpace:"nowrap"}}>{toast}</div>}
    </div>
  )
}

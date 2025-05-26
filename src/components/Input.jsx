export default function Input(prop) {
    return (
        <>
        <div className="flex flex-col relative">
            <label className="w-full font-bold">{prop.label}</label>
            <input autoComplete={prop.autoComplete} name={prop.name} onChange={prop.onChange} value={prop.value}
            type={prop.type} className={prop.className} placeholder={`Enter ${prop.label}`} required={!!prop.required} />
            {prop.children}
        </div>
        </>
    )
}


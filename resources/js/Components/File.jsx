import { forwardRef, useRef } from 'react';

export default forwardRef(function FileUpload(
    { type = 'file', name, id, value, className, multiple, required, handleChange },
    ref
) {
    const input = ref ? ref : useRef();
    
    return (
        <div className="flex flex-col items-start">
            <input
                type={type}
                name={name}
                id={id}
                value={value}
                className={
                    `border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded ` +
                    className
                }
                ref={input}
                required={required}
                multiple={multiple}
                onChange={(e) => handleChange(e)}
            />
        </div>
    );
});

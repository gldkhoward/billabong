'use client';

import { forwardRef, useRef, useLayoutEffect, useState } from 'react';

type FormFieldProps = {
  label: string;
  error?: string;
  required?: boolean;
  prefix?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'textarea';
  rows?: number;
  className?: string;
} & (
  | React.InputHTMLAttributes<HTMLInputElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>
);

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ label, error, required, prefix, placeholder, type = 'text', rows, className, ...props }, ref) => {
    const prefixRef = useRef<HTMLSpanElement>(null);
    const [prefixWidth, setPrefixWidth] = useState(0);

    useLayoutEffect(() => {
      if (prefixRef.current && prefix) {
        setPrefixWidth(prefixRef.current.offsetWidth);
      }
    }, [prefix]);

    const inputClasses = `w-full py-2.5 sm:py-3 border-2 ${
      error ? 'border-red-500' : 'border-river-teal/30'
    } rounded-xl font-body text-sm sm:text-base focus:border-river-teal focus:outline-none transition-all ${className || ''}`;

    return (
      <div>
        <label className="block font-heading font-semibold text-base sm:text-lg text-deep-indigo mb-2">
          {label} {required && <span className="text-river-teal">*</span>}
        </label>
        
        {type === 'textarea' ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            placeholder={placeholder}
            rows={rows || 3}
            className={inputClasses + ' px-3 sm:px-4 resize-none'}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <div className="relative flex items-center">
            {prefix && (
              <span 
                ref={prefixRef}
                className="absolute left-3 sm:left-4 text-charcoal/50 font-body text-sm sm:text-base leading-none pointer-events-none select-none"
              >
                {prefix}
              </span>
            )}
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              type={type}
              placeholder={placeholder}
              className={inputClasses + ' leading-none'}
              style={
                prefix && prefixWidth > 0
                  ? { paddingLeft: `${prefixWidth + 16}px`, paddingRight: '12px' }
                  : { paddingLeft: '12px', paddingRight: '12px' }
              }
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          </div>
        )}
        
        {error && (
          <p className="mt-2 text-sm text-red-500 font-body">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';


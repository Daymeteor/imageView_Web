/**
 * shadcn/ui 风格 Dialog 原语
 * 基于 Radix UI Dialog，使用项目主题 token 定制样式
 */

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(function DialogOverlay(
  { className, ...props },
  ref
) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-[var(--color-bg-deep)]/90 backdrop-blur-xl',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
        className
      )}
      {...props}
    />
  );
});

const DialogContent = React.forwardRef(function DialogContent(
  { className, children, showCloseButton = false, ...props },
  ref
) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
          'data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            className={cn(
              'absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center',
              'rounded-full border border-[var(--color-accent-card-border)]',
              'bg-[var(--color-accent-glass-bg)] text-[var(--color-accent-dim)]',
              'backdrop-blur-md transition-colors hover:text-[var(--color-accent-light)]',
              'hover:border-[var(--color-accent-card-border-hover)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]'
            )}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">关闭</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col gap-2 text-center sm:text-left',
      className
    )}
    {...props}
  />
);

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
      className
    )}
    {...props}
  />
);

const DialogTitle = React.forwardRef(function DialogTitle(
  { className, ...props },
  ref
) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        'font-[family-name:var(--font-display)] text-lg font-normal leading-none tracking-wide text-[var(--color-accent-pale)]',
        className
      )}
      {...props}
    />
  );
});

const DialogDescription = React.forwardRef(function DialogDescription(
  { className, ...props },
  ref
) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn(
        'text-sm text-[var(--color-text-secondary)]',
        className
      )}
      {...props}
    />
  );
});

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};

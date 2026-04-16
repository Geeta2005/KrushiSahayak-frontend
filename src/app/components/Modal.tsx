import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { CheckCircle, XCircle, Info } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  type: "success" | "error" | "info";
  showConfirmButton?: boolean;
  confirmText?: string;
  onConfirm?: () => void;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  type,
  showConfirmButton = false,
  confirmText = "OK",
  onConfirm,
}: ModalProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="size-6 md:size-8 text-green-600" />;
      case "error":
        return <XCircle className="size-6 md:size-8 text-red-600" />;
      case "info":
        return <Info className="size-6 md:size-8 text-blue-600" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case "success":
        return "bg-green-100";
      case "error":
        return "bg-red-100";
      case "info":
        return "bg-blue-100";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`rounded-full p-3 ${getIconBg()}`}>
              {getIcon()}
            </div>
            <DialogTitle className="text-lg md:text-xl">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-sm md:text-base text-center">
                {description}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>
        <DialogFooter className="flex justify-center sm:justify-center">
          <Button
            onClick={() => {
              if (onConfirm) {
                onConfirm();
              }
              onClose();
            }}
            className="w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

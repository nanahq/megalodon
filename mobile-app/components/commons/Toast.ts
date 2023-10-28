import Toast  from "react-native-toast-message";
import { ToastType } from "react-native-toast-notifications";

export const ShowToast = (type: 'success' | 'error', message: string) => {
    Toast.show({
        type: type,
        text1: message,
        autoHide: true
    });
}

export const showTost =  (toast: ToastType, message: string, type: 'success' | 'error' ): void  =>{
    toast.hideAll()
    toast.show(message, {
        type: `app_toast_${type}`,
        placement: "top",
        duration: 3000,
    })
}

export const showToastStandard = (message: string, type: 'success'  | 'error'): void => {
    Toast.show({
        type: `app_toast_${type}`,
        text1: message,
        autoHide: true
    })
}
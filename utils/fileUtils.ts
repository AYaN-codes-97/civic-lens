
export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // result is a data URL: data:image/jpeg;base64,...
            // We only need the base64 part
            if (reader.result) {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            } else {
                reject(new Error("FileReader result is null"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

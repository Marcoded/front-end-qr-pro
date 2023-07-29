const urlValidator = (urlString: string): boolean => {
    try {
        new URL(urlString);
        return true;
    } catch (e: unknown) {
        return false;  
    }
};

export default urlValidator;

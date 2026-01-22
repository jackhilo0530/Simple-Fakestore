export function errorHandler(c: any) {
    return (error: any) => {
        console.error(error);
        return c.json({error: "Something went wrong"}, 500);
    };
}
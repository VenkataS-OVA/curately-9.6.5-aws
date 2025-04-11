type Valuable<T> = { [K in keyof T as T[K] extends null | undefined ? never : K]: T[K] };

function RemoveEmptyValuesInObject<
    // eslint-disable-next-line @typescript-eslint/ban-types
    T extends {},
    V = Valuable<T>,
>(obj: T): V {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([, v]) =>
                !(
                    (typeof v === 'string' && !v.length) ||
                    v === null ||
                    typeof v === 'undefined'
                ),
        ),
    ) as V;
}

export default RemoveEmptyValuesInObject;
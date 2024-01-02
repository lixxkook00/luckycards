export * from './Metamask';

export const shortenAddress = (address, length = 8) => {
    if (address.length <= length) {
        return address;
    } else {
        const prefix = address.substring(0, length / 2);
        const suffix = address.substring(address.length - length / 2);
        return `${prefix}...${suffix}`;
    }
}
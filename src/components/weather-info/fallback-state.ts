export enum FallbackState {
    Loading,
    CannotFindUserTemp,
    InsertedLocationTempUnavailable
}

export const fallbackStateToText: Record<FallbackState, string> = {
    [FallbackState.Loading]: 'Loading...',
    [FallbackState.CannotFindUserTemp]: 'Cannot find the temperature of your current location. Please try insert coordinates',
    [FallbackState.InsertedLocationTempUnavailable]: 'Current temperature is unavailable. Please try different coordinates',
}

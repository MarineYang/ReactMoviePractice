export const makeImgPath = (ImgUrl: string, width: string = "w500") => 
`https://image.tmdb.org/t/p/${width}${ImgUrl}`;
import { ReportType } from '../enums/report-type.enum';

export class Report {
  private id: number;
  private type: ReportType;
  private fileUrl: string;
  private usersId: number;
  private seasonsId: number;

  constructor(
    id: number,
    type: ReportType,
    fileUrl: string,
    usersId: number,
    seasonsId: number,
  ) {
    this.id = id;
    this.type = type;
    this.fileUrl = fileUrl;
    this.usersId = usersId;
    this.seasonsId = seasonsId;
  }
  getId():number{
    return this.id;
  }
  getType():ReportType{
    return this.type;
  }
  getFileUrl():string{
    return this.fileUrl;
  }
  getUsersId():number{
    return this.usersId;
  }
  getSeasonsId():number{
    return this.seasonsId;
  }
}

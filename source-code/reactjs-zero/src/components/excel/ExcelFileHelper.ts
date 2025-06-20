import UiUtils from "@ord-core/utils/ui.utils";
import FileSaver from "file-saver";
import {FileUploadDto} from "@api/index.defs";
import {UploadFileService} from "@api/UploadFileService";

export const handleDownloadFileByFileInfo = async (fileInfo: FileUploadDto) => {
    try {
        UiUtils.setBusy();
        const blob = await UploadFileService.getFileFromCache({
            fileCacheId: fileInfo.fileId ?? ""
        }, {responseType: 'blob'})

        FileSaver.saveAs(blob, fileInfo?.fileName);
    } catch {
        throw new Error();
    } finally {
        UiUtils.clearBusy();
    }
}
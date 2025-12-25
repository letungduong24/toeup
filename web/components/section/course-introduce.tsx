import { FaBoltLightning } from "react-icons/fa6";
import { Card } from "../ui/card";
import { FaStickyNote } from "react-icons/fa";
import { MdQuestionAnswer } from "react-icons/md";
import { IoIosDocument } from "react-icons/io";

const CourseIntroduce = () => {
  return (
    <div className="z-20 flex justify-center flex-col items-center gap-3">
      <h1 className='text-center text-2xl font-bold'>Chế độ luyện tập đa dạng</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-full max-w-6xl bg-gray-100 p-4 rounded-2xl dark:bg-zinc-800">
        <div className="w-full h-full">
          <img className="w-full rounded-2xl h-full" src="/3.png" alt="" />
        </div>
        <div className="w-full grid grid-cols-2 gap-4">
          <Card className="w-full flex justify-center items-start p-5 rounded-2xl flex-col gap-2">
            <FaBoltLightning className="text-3xl" />
            <div>
              <p className="text-xl font-bold">Trắc nghiệm</p>
              <p className="text-sm text-muted-foreground">Chọn đáp án đúng từ các lựa chọn</p>
            </div>
          </Card>
          <Card className="w-full flex justify-center items-start p-5 rounded-2xl flex-col gap-2">
            <FaStickyNote className="text-3xl" />
            <div>
              <p className="text-xl font-bold">Điền từ</p>
              <p className="text-sm text-muted-foreground">Điền từ tiếng Anh thích hợp</p>
            </div>
          </Card>
          <Card className="w-full flex justify-center items-start p-5 rounded-2xl col-span-2 flex-col gap-2">
            <MdQuestionAnswer className="text-3xl" />
            <div>
              <p className="text-xl font-bold">Viết câu</p>
              <p className="text-sm text-muted-foreground">Luyện tập viết câu hoàn chỉnh (AI chấm điểm)</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseIntroduce;

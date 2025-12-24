'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useFolderStore from '@/store/folder.store';
import { FolderResponse } from '@/types/folder';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { BsFolder } from 'react-icons/bs';
import { PiStarFour } from 'react-icons/pi';
import { FaPlus } from 'react-icons/fa';
import CreateFolderModal from '@/components/flashcard/create-folder-modal';
import AIAssistantModal from '@/components/flashcard/ai-assistant-modal';

interface SelectFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (folderId: string) => void;
}

export default function SelectFolderDialog({
  open,
  onOpenChange,
  onSelect,
}: SelectFolderDialogProps) {
  const { folders, loading, fetchFolders } = useFolderStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useEffect(() => {
    if (open) {
      fetchFolders(true);
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Chọn Flashbook để luyện tập</DialogTitle>
            <DialogDescription>
              Chọn một flashbook để bắt đầu luyện tập
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : folders.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <BsFolder className="h-6 w-6" />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có Flashbook nào</EmptyTitle>
                  <EmptyDescription>
                    Bắt đầu tạo Flashbook đầu tiên của bạn để bắt đầu học từ vựng
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button
                      onClick={() => {
                        setIsCreateModalOpen(true);
                      }}
                      className="flex-1"
                    >
                      <FaPlus className="mr-2 h-4 w-4" />
                      Tạo thủ công
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAIModalOpen(true);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <PiStarFour className="mr-2 h-4 w-4" />
                      Trợ lý AI
                    </Button>
                  </div>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="space-y-2 overflow-hidden p-1">
                {folders.map((folder) => (
                  <motion.div
                    key={folder.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-auto p-4 flex items-center gap-3 hover:bg-accent text-left justify-start"
                      onClick={() => {
                        onSelect(folder.id);
                        onOpenChange(false);
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{folder.name}</div>
                        <div className="text-sm text-muted-foreground font-normal">
                          {(folder.newCount ?? 0) + (folder.reviewCount ?? 0)} từ vựng
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <CreateFolderModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          fetchFolders(true);
        }}
      />
      <AIAssistantModal
        open={isAIModalOpen}
        onOpenChange={setIsAIModalOpen}
        onSuccess={() => {
          fetchFolders(true);
        }}
      />
    </>
  );
}

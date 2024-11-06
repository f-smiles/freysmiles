'use client'

import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup } from '@/components/ui/toggle-group'
import { BoldIcon, ItalicIcon, ListIcon, ListOrderedIcon, StrikethroughIcon, UnderlineIcon } from 'lucide-react'


const Tiptap = ({ value }: { value: string }) => {

  const { setValue } = useFormContext()

  const editor = useEditor({
    content: value,
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4'
          }
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4'
          }
        },
      }),
      Underline.configure({}),
    ],
    editorProps: {
      attributes: {
        class: 'flex flex-col min-h-40 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
      }
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      setValue("description", content, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  })

  useEffect(() => {
    if (editor?.isEmpty) editor.commands.setContent(value)
  }, [value])

  return (
    <div className='flex flex-col gap-3'>
      {editor && (
        <ToggleGroup type='multiple' size='sm' className='border rounded-md w-max border-input'>
          <Toggle
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            pressed={editor.isActive('bold')}
          >
            <BoldIcon className='w-4 h-4' />
          </Toggle>

          <Toggle
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            pressed={editor.isActive('italic')}
          >
            <ItalicIcon className='w-4 h-4' />
          </Toggle>

          <Toggle
            onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
            pressed={editor.isActive('underline')}
          >
            <UnderlineIcon className='w-4 h-4' />
          </Toggle>

          <Toggle
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            pressed={editor.isActive('strike')}
          >
            <StrikethroughIcon className='w-4 h-4' />
          </Toggle>

          <Toggle
            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            pressed={editor.isActive('orderedList')}
          >
            <ListOrderedIcon className='w-4 h-4' />
          </Toggle>

          <Toggle
            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            pressed={editor.isActive('bulletList')}
          >
            <ListIcon className='w-4 h-4' />
          </Toggle>
        </ToggleGroup>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}

export default Tiptap

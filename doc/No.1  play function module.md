
---
#  what's this file do ? 

*This file compensate the process of playing

# handle_keydown_for_play()
To watch user input and del meta , ctl , alt ... 
Format input  be identifiable  for playing , comparison
target code.
 And  visit code_play.vue .  this code dosen't use textarea.


# comparison_input_and_add_class_to_span()
When typed backspace argument is string of delete. And if it ? guess what. 
Now position of span's class removed 'correct or in~ ' and add 'untyped'

# del space after line break process
we got 'char_all_spans_as_a_array_elm' as all spans in code_display html elm. 
But when typing formatted code 
```ts
function main(): void {
    console.log('I love coffe btw ._.')
}
```

after "{" in line 1. untill "c" there are some space. 
bcs of , formatting. 
so format spans ignore space after line break  in *format_to_ignore_space_after_line_break()* .
But this func dosen't ignore between spacing. like *'function<here!!>main'* .
then. we can type without space after line break

*how it works ?*
variable space_start_point and space_end_point represents the position of start space and end of space .

if there are space after line break. space_start_point become the index of i variable.
Do it  until char_span_arr[i].textContent is not /u00A0(space) then space_end_point become the i.
And we can get start of spacing also end as variables.

# playing
Use  essenced_spans_for_comparison variable to identify input is correct or not.
Its spaces after line break were already removed in function.
Comparing method in function of comparison_input_and_add_class_to_span.


# Timer 
No explain feel code 👨‍💻😎 (write later)

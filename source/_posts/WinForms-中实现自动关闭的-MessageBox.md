---
title: WinForms 中实现自动关闭的 MessageBox
category_bar:
  - C#
tags:
  - C#
  - WinForms
categories:
  - - 编程
    - C#
updated: '2023-07-13 15:42:03='
index_img: images/MessageBox.jpg
abbrlink: 1883a8de
date: 2023-07-13 15:42:03
description:
---
在许多软件应用程序中，经常需要显示一段时间后自动关闭的消息框。这种功能可以为用户提供及时的反馈，同时又不会干扰用户的操作。本文将介绍一个使用 C# 编写的自动关闭消息框的代码示例，并详细解释其实现原理。

## 代码示例

```csharp
private async void ShowMessageBoxInThread(string message, int time = 1000, string title = "提示")
{
    await Task.Run(() => AutoClosingMessageBox.Show(message, title, time));
}

public class AutoClosingMessageBox
{
    System.Threading.Timer _timeoutTimer;
    string _caption;

    AutoClosingMessageBox(string text, string caption, int timeout)
    {
        _caption = caption;
        _timeoutTimer = new System.Threading.Timer(OnTimerElapsed,
            null, timeout, System.Threading.Timeout.Infinite);
        using (_timeoutTimer)
            MessageBox.Show(text, caption, MessageBoxButtons.OK, MessageBoxIcon.Information);
    }

    public static void Show(string text, string caption, int timeout)
    {
        new AutoClosingMessageBox(text, caption, timeout);
    }

    void OnTimerElapsed(object state)
    {
        IntPtr mbWnd = FindWindow("#32770", _caption); // lpClassName is #32770 for MessageBox
        if (mbWnd != IntPtr.Zero)
            SendMessage(mbWnd, WM_CLOSE, IntPtr.Zero, IntPtr.Zero);
        _timeoutTimer.Dispose();
    }

    const int WM_CLOSE = 0x0010;
    [System.Runtime.InteropServices.DllImport("user32.dll", SetLastError = true)]
    static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
    [System.Runtime.InteropServices.DllImport("user32.dll", CharSet = System.Runtime.InteropServices.CharSet.Auto)]
    static extern IntPtr SendMessage(IntPtr hWnd, UInt32 Msg, IntPtr wParam, IntPtr lParam);
}
```

## 实现原理

让我们逐步解释上述代码的实现原理。

### ShowMessageBoxInThread 方法

首先，我们有一个私有的异步方法`ShowMessageBoxInThread`，它接受三个参数：`message`表示要显示的消息内容，`time`表示消息框显示的时间（默认为1秒），`title`表示消息框的标题（默认为"提示"）。

```csharp
private async void ShowMessageBoxInThread(string message, int time = 1000, string title = "提示")
{
    await Task.Run(() => AutoClosingMessageBox.Show(message, title, time));
}
```

在方法内部，我们使用`Task.Run`创建一个异步任务，并调用`AutoClosingMessageBox.Show`方法。通过将消息内容、标题和显示时间传递给`Show`方法，我们将显示一个自动关闭的消息框。

### AutoClosingMessageBox 类

`AutoClosingMessageBox`类是实现自动关闭消息框的核心部分。

首先，它包含了一个私有字段`_timeoutTimer`和一个表示消息框标题的字段`_caption`。

```csharp
public class AutoClosingMessageBox
{
    System.Threading.Timer _timeoutTimer;
    string _caption;
    // ...
}
```

构造函数`AutoClosingMessageBox`接受消息内容、标题和超时时间作为参数。

```csharp
AutoClosingMessageBox(string text, string caption, int timeout)
{
    _caption = caption;
    _timeoutTimer = new System.Threading.Timer(OnTimerElapsed,
        null, timeout, System.Threading.Timeout.Infinite);
    using (_timeoutTimer)
        MessageBox.Show(text, caption, MessageBoxButtons.OK, MessageBoxIcon.Information);
}
```

在构造函数内部，首先设置了一个计时器`_timeoutTimer`，它在指定的超时时间后触发回调函数`OnTimerElapsed`。计时器的工作是在超时后关闭消息框。

当初始化定时器时，我们使用 `new System.Threading.Timer(OnTimerElapsed, null, timeout, System.Threading.Timeout.Infinite)` 这段代码。它创建了一个新的 `System.Threading.Timer` 实例，并设置了相关参数：

- `OnTimerElapsed` 是定时器触发时要执行的回调方法。
- `null` 表示传递给回调方法的状态对象，这里我们不需要传递额外的状态信息。
- `timeout` 表示定时器的超时时间，即经过多少毫秒后触发回调方法。
- `System.Threading.Timeout.Infinite` 表示定时器只触发一次，并不会重复。

`using` 语句是一种资源管理语句，用于确保在使用完毕后正确释放资源。在这里，我们使用 `using` 语句来管理 `_timeoutTimer` 对象的生命周期。当执行到 `using` 语句的末尾时，会自动调用 `_timeoutTimer.Dispose()` 方法来释放定时器资源。

接下来，使用`MessageBox.Show`方法显示消息框，并传递消息内容、标题以及信息图标。

### OnTimerElapsed 方法

`OnTimerElapsed`方法是计时器回调函数，它在超时时被调用。

```csharp
void OnTimerElapsed(object state)
{
    IntPtr mbWnd = FindWindow("#32770", _caption); // lpClassName is #32770 for MessageBox
    if (mbWnd != IntPtr.Zero)
        SendMessage(mbWnd, WM_CLOSE, IntPtr.Zero, IntPtr.Zero);
    _timeoutTimer.Dispose();
}
```

在`OnTimerElapsed`方法中，首先通过`FindWindow`函数查找具有指定标题的消息框的句柄。如果找到了消息框的句柄，就使用`SendMessage`函数发送关闭消息给消息框，即通过向消息框发送`WM_CLOSE`消息来关闭它。最后，我们释放计时器资源。

### DllImport 特性

代码中还使用了 DllImport 特性，用于声明`FindWindow`和`SendMessage`方法，以便在 C# 代码中使用这些来自 user32.dll 的本机函数。

```csharp
const int WM_CLOSE = 0x0010;
[System.Runtime.InteropServices.DllImport("user32.dll", SetLastError = true)]
static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
[System.Runtime.InteropServices.DllImport("user32.dll", CharSet = System.Runtime.InteropServices.CharSet.Auto)]
static extern IntPtr SendMessage(IntPtr hWnd, UInt32 Msg, IntPtr wParam, IntPtr lParam);
```

这些特性允许我们直接调用 Windows API 函数，以实现与操作系统交互的功能。

- `const int WM_CLOSE = 0x0010;` 定义了一个常量 `WM_CLOSE`，它代表了关闭窗口的消息代码。
- `[System.Runtime.InteropServices.DllImport("user32.dll", SetLastError = true)]` 是一个 `DllImport` 特性，用于指示在 `user32.dll` 库中查找并导入函数。`SetLastError` 参数设置为 `true`，以便在函数调用失败时记录错误状态。
- `static extern IntPtr FindWindow(string lpClassName, string lpWindowName);` 声明了一个名为 `FindWindow` 的本机函数，它在 `user32.dll` 中查找具有指定类名和窗口名的顶层窗口。它返回找到的窗口的句柄。
- `static extern IntPtr SendMessage(IntPtr hWnd, UInt32 Msg, IntPtr wParam, IntPtr lParam);` 声明了一个名为 `SendMessage` 的本机函数，它向指定的窗口发送指定的消息。`hWnd` 参数是窗口的句柄，`Msg` 参数是要发送的消息代码，`wParam` 和 `lParam` 参数是消息的参数。

这些代码用于在 C# 中与 Windows API 进行交互。通过 `FindWindow` 函数找到指定标题的窗口句柄，并使用 `SendMessage` 函数向该窗口发送关闭消息。这样可以实现在定时器回调方法中自动关闭消息框的功能。

## 使用示例

通过使用以上的代码，我们可以在应用程序中使用`ShowMessageBoxInThread`方法来显示一个自动关闭的消息框。例如：

```csharp
ShowMessageBoxInThread("操作已完成！", 2000, "成功");
```

以上代码将在一个新的线程中显示一个带有"成功"标题的消息框，显示内容为"操作已完成！"，并在2秒后自动关闭。


## 参考链接

[Close a MessageBox after several seconds](https://stackoverflow.com/questions/14522540/close-a-messagebox-after-several-seconds)
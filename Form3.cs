using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Windows.Forms;

namespace Wgrywanie_Oprogramowania_JH
{
    public partial class Form3 : Form
    {
        
        int etap;
        public Form3()
        {
            etap = 2;
            InitializeComponent();      
        }
        private void Button1_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }
        public void CopyFilesRecursively(string sourcePath, string targetPath)
        {
            ThreadPool.QueueUserWorkItem((z) =>
            {
                button2.Invoke(new MethodInvoker(delegate { label1.Text = "Wgrywanie Danych"; }));
                button2.Invoke(new MethodInvoker(delegate { checkBox2.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255))))); }));
                button2.Invoke(new MethodInvoker(delegate { button2.Enabled = false; }));
                foreach (string dirPath in Directory.GetDirectories(sourcePath, "*", SearchOption.AllDirectories))
                {
                Directory.CreateDirectory(dirPath.Replace(sourcePath, targetPath));
                    this.BeginInvoke(new Action(() => progressBar1.PerformStep()));
                }
                foreach (string newPath in Directory.GetFiles(sourcePath, "*.*", SearchOption.AllDirectories))
                {
                File.Copy(newPath, newPath.Replace(sourcePath, targetPath), true);
                    this.BeginInvoke(new Action(() => progressBar1.PerformStep()));
                }
                button2.Invoke(new MethodInvoker(delegate { checkBox2.BackColor = System.Drawing.Color.Green; }));
                button2.Invoke(new MethodInvoker(delegate { checkBox2.CheckState = CheckState.Checked; }));
                button2.Invoke(new MethodInvoker(delegate { button2.Enabled = true; }));
                button2.Invoke(new MethodInvoker(delegate { label1.Text = "Wgrywanie Danych ukończone naciśnij OK"; }));
            }, null);
        }
        private void RemoveDirectories(string strpath)
        {
            ThreadPool.QueueUserWorkItem((o) =>
            {
                if (Directory.Exists(strpath))
                {
                    DirectoryInfo dirInfo = new DirectoryInfo(strpath);
                    var files = dirInfo.GetFiles();
                    this.BeginInvoke(new Action(() =>
                    {
                        progressBar1.Minimum = 0;
                        progressBar1.Value = 0;
                        progressBar1.Maximum = files.Length;
                        progressBar1.Step = 1;
                    }));

                    foreach (FileInfo file in files)
                    {
                        file.Delete();
                        this.BeginInvoke(new Action(() => progressBar1.PerformStep())); 
                    }
                    var dirs = dirInfo.GetDirectories();
                    this.BeginInvoke(new Action(() =>
                    {
                        progressBar1.Value = 0;
                        progressBar1.Maximum = dirs.Length;
                    }));

                    foreach (DirectoryInfo dir in dirs)
                    {
                        dir.Delete(true);
                        this.BeginInvoke(new Action(() => progressBar1.PerformStep()));
                    }
                    if(progressBar1.Value < progressBar1.Maximum)
                    {
                        this.BeginInvoke(new Action(() => progressBar1.Value = progressBar1.Maximum));
                    }
                    button2.Invoke(new MethodInvoker(delegate { button2.Enabled = true;}));
                    button2.Invoke(new MethodInvoker(delegate { checkBox1.BackColor = System.Drawing.Color.Green; checkBox1.CheckState = CheckState.Checked; }));
                    button2.Invoke(new MethodInvoker(delegate { label1.Text = "Dane zostały usunięte naciśnij ok"; }));
                }
            }, null);
        }
        private void Button2_Click(object sender, EventArgs e)
        {
            button2.Enabled = false;
            etap++;
            
            if (etap == 1)
            {
               DriveInfo[] allDrives = DriveInfo.GetDrives();
                if (allDrives[2].IsReady && allDrives[2].Name == "E:\\")
                {
                    label1.Text = "Usuwanie nieaktualnych danych z karty SD";

                    if (System.IO.Directory.Exists(@"E:\"))
                    {
                        RemoveDirectories(@"E:\");  
                    }
                }
                else
                {
                var result = MessageBox.Show("Nie włożono karty SD !!!", "UWAGA", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
                
            }
            if (etap == 2)
            {
                progressBar1.Value = 0;
                progressBar1.Maximum = 345;
                CopyFilesRecursively(@"C:\beckhoff\", @"E:\");               
            }
            if (etap == 3)
            {
                label1.Text = "Wyjmij karte SD z komputera";
                button2.Text = "Przejście do kolejnego modułu programowania skrzynek JH";
                button2.Enabled = true;
            }
            if (etap == 4)
            {
                Form1.ActiveForm.Visible = true;
                
               
                this.Close();
            }


        }
    }
}

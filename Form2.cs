using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Wgrywanie_Oprogramowania_JH
{
    public partial class Form2 : Form
    {
        string[] user;
        int roz;
        public Form2()
        {
            InitializeComponent();
        }

        private void TextBox1_TextChanged(object sender, EventArgs e)
        {
            if (System.Text.RegularExpressions.Regex.IsMatch(textBox1.Text, "[^0-9]"))
            {
                MessageBox.Show("Proszę wprowadzić numer osobowy");
                textBox1.Text = textBox1.Text.Remove(textBox1.Text.Length - 1);
            }
        }

        private void Button1_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void Button2_Click(object sender, EventArgs e)
        {
            user = new string[10];
            roz = 0;
            
            string path = @".\Wgrywanie oprogramowania\users\konta.txt";
            using (StreamReader sr = File.OpenText(path))
            {         
                string s = "";
                while ((s = sr.ReadLine()) != null)
                {
                    
                    user[roz] = s;
                    roz++;
                }
            }
            bool gitesLogo = false;
            bool gitesPass = false;
            for(int i = 0; i < 10; i++)
            {
                if (textBox1.Text == user[i])
                {
                    gitesLogo = true;
                    if (textBox2.Text == user[i + 1])
                    {
                        this.Visible = false;
                        Form1 f1 = new Form1();
                        f1.ShowDialog();
                        gitesPass = true;
                    }
                    else
                    {
                        textBox2.BackColor = Color.Red;
                        haslo.Text = "Błędne hało sprubuj ponownie";
                        haslo.ForeColor = Color.Red;
                        haslo.Visible = true;
                    }
                }
            }
            if (gitesLogo==false)
            {
                textBox1.BackColor = Color.Red;
                logo.Text = "Nie ma takiego konta spróbuj ponownie";
                logo.ForeColor = Color.Red;
                logo.Visible = true;
            }
        }

        
    }
}


import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_ANONKEY;

const SUPABASE_URL = "https://ucsbftnqollsezmzmszx.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const override = css`
  display: block;
  margin: 0 auto;
`;

function escutaMensagensEmTempoReal(adicionaMensagem) {
  return supabaseClient
    .from("mensagens")
    .on("INSERT", (resposta) => {
      adicionaMensagem(resposta.new);
    })
    .subscribe();
}

export default function ChatPage() {
  // Sua lógica vai aqui
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;
  const [mensagem, setMensagem] = useState("");
  const [listaDeMensagens, setListaDeMensagens] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    setLoading(true);
    await fetch("/").then(() => {});
    setLoading(false);
  }

  useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListaDeMensagens(data);
      });

    fetchData();

    escutaMensagensEmTempoReal((novaMensagem) => {
      setListaDeMensagens((valorAtualDaLista) => {
        return [novaMensagem, ...valorAtualDaLista];
      });
    });
  }, []);

  // ./Sua lógica vai aqui
  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: usuarioLogado,
      texto: novaMensagem,
      deleta: false,
    };

    supabaseClient
      .from("mensagens")
      .insert([mensagem])
      .then(({ data }) => {});

    setMensagem("");
  }

  async function handleDeletaMensagem(id) {
    const { data, erro } = await supabaseClient
      .from("mensagens")
      .delete()
      .match({ id });
  }

  function atualizaMensagens() {
    setListaDeMensagens(
      listaDeMensagens.filter((e) => {
        return !e.deleta;
      })
    );
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: "url(https://wallpaperaccess.com/full/3553162.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "90%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
          opacity: "0.95",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList
            mensagens={listaDeMensagens}
            atualizaListaDeMensagens={setListaDeMensagens}
            deletaMensagem={handleDeletaMensagem}
            atualizaListaDeMensagens={atualizaMensagens}
            loading={loading}
          />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Box
              styleSheet={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ButtonSendSticker
                onStickerClick={(sticker) => {
                  handleNovaMensagem(`:sticker: ${sticker}`);
                }}
              />
              <Button
                styleSheet={{
                  borderRadius: "50%",
                  padding: "0 3px 0 0",
                  minWidth: "50px",
                  minHeight: "50px",
                  fontSize: "20px",
                  marginBottom: "8px",
                  marginLeft: "8px",
                  lineHeight: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: appConfig.theme.colors.neutrals[300],
                  hover: {
                    backgroundColor: appConfig.theme.colors.primary[600],
                  },
                }}
                label="✔️"
                onClick={() => {
                  handleNovaMensagem(mensagem);
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button variant="tertiary" colorVariant="light" label="Sair" href="/" />
      </Box>
    </>
  );
}

function MessageList(props) {
  return (
    <>
      <Box
        styleSheet={{
          marginTop: "100px",
        }}
      >
        {props.loading ? (
          <ClipLoader
            color={appConfig.theme.colors.primary["700"]}
            loading={props.loading}
            css={override}
            size={150}
          />
        ) : (
          ""
        )}
      </Box>
      <Box
        tag="ul"
        styleSheet={{
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column-reverse",
          flex: 1,
          color: appConfig.theme.colors.neutrals["000"],
          marginBottom: "16px",
        }}
      >
        {props.mensagens.map((mensagem) => {
          return (
            <Text
              key={mensagem.id}
              tag="li"
              styleSheet={{
                borderRadius: "5px",
                padding: "6px",
                marginBottom: "12px",
                hover: {
                  backgroundColor: appConfig.theme.colors.neutrals[700],
                },
              }}
            >
              <Box
                styleSheet={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Image
                    styleSheet={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      display: "inline-block",
                      marginRight: "8px",
                    }}
                    src={`https://github.com/${mensagem.de}.png`}
                  />
                  <Text tag="strong">{mensagem.de}</Text>
                  <Text
                    styleSheet={{
                      fontSize: "10px",
                      marginLeft: "8px",
                      color: appConfig.theme.colors.neutrals[300],
                    }}
                    tag="span"
                  >
                    {new Date().toLocaleDateString()}
                  </Text>
                </Box>
                <Button
                  onClick={() => {
                    mensagem.deleta = true;
                    props.deletaMensagem(mensagem.id);
                    props.atualizaListaDeMensagens();
                  }}
                  iconName="times"
                  variant="tertiary"
                  colorVariant="light"
                  rounded="full"
                />
              </Box>
              {mensagem.texto.startsWith(":sticker:") ? (
                <Image
                  styleSheet={{
                    width: "150px",
                    height: "150px",
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                  src={mensagem.texto.replace(":sticker:", "")}
                />
              ) : (
                mensagem.texto
              )}
            </Text>
          );
        })}
      </Box>
    </>
  );
}

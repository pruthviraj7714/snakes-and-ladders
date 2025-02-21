import Board from "../../../../components/Board";


export default async function GamePage({params} : {
  params : Promise<{gameId : string}>
}) {

  const gameId = (await params).gameId;


  return (
    <div className="">
      <Board gameId={gameId}  />
    </div>
  )
}